// backend/controllers/userController.js
const User = require('../models/User');
const Project = require('../models/Project');

function slugify(name) {
  const base = (name || 'user').toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;
    const allowed = {};
    const fields = [
      'name', 'bio', 'skills', 'github', 'linkedin', 'phone',
      'location', 'education', 'certifications', 'avatar'
    ];
    fields.forEach(f => {
      if (data[f] !== undefined) allowed[f] = data[f];
    });

    if (allowed.skills && !Array.isArray(allowed.skills)) {
      allowed.skills = typeof allowed.skills === 'string'
        ? allowed.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    }

    if (data.education && typeof data.education === 'object') {
      allowed.education = {
        college: data.education.college || '',
        startYear: data.education.startYear || '',
        endYear: data.education.endYear || '',
        cgpa: data.education.cgpa || ''
      };
    } else {
      const { college, startYear, endYear, cgpa } = data;
      if (college || startYear || endYear || cgpa) {
        allowed.education = { college, startYear, endYear, cgpa };
      }
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, allowed);

    // Preserve slug if it already exists
    if (!user.slug) {
      user.slug = `${user.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random()
        .toString(36)
        .substring(2, 6)}`;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).send('Server error');
  }
};

// Avatar Upload
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file?.path) return res.status(400).json({ message: 'No image' });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true }
    ).select('-password');
    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Publish / Unpublish Portfolio + store theme
exports.publishPortfolio = async (req, res) => {
  try {
    const { publish, theme } = req.body;

    if (typeof publish !== 'boolean')
      return res.status(400).json({ message: 'publish must be boolean' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.published = publish;

    if (theme) user.theme = theme;

    // create slug if not exists
    if (!user.slug) {
      user.slug = `${user.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random()
        .toString(36)
        .substring(2, 6)}`;
    }

    await user.save();

    res.json({
      message: 'Portfolio status updated successfully',
      published: user.published,
      theme: user.theme,
      slug: user.slug
    });
  } catch (err) {
    console.error('publishPortfolio error:', err);
    res.status(500).send('Server error');
  }
};

// Public portfolio (accessible via /api/users/public/:username)
exports.getPublicProfile = async (req, res) => {
  try {
    const slug = req.params.username;
    const user = await User.findOne({ slug }).select('-password').lean();

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.published)
      return res.status(403).json({
        message:
          'Portfolio not visible. Please publish it from your Portfolio Builder page.'
      });

    const projects = await Project.find({ owner: user._id, published: true })
      .populate('tasks')
      .lean();

    // return all user info + theme
    res.json({
      user: {
        name: user.name,
        slug: user.slug,
        email: user.email,
        bio: user.bio || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        location: user.location || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        skills: user.skills || [],
        education: user.education || {},
        theme: user.theme || 'minimal'
      },
      projects
    });
  } catch (err) {
    console.error('getPublicProfile error:', err);
    res.status(500).send('Server error');
  }
};