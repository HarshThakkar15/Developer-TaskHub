// src/components/UI/ConfirmDialog.js
import React from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div style={{
        background: '#fff',
        padding: '20px 30px',
        borderRadius: '10px',
        textAlign: 'center',
        width: '320px'
      }}>
        <h3 style={{marginBottom: '15px'}}>{message}</h3>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <button className="button" onClick={onConfirm}>Yes</button>
          <button className="button" style={{background:'#aaa'}} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}