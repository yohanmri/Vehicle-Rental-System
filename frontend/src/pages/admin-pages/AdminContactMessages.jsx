import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Mail, Check, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/admin/contact');
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.patch(`/api/admin/contact/${id}`, { status: 'read' });
            setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'read' } : m));
            toast.success('Message marked as read');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        
        try {
            await axios.delete(`/api/admin/contact/${id}`);
            setMessages(prev => prev.filter(m => m._id !== id));
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
                <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#1e2a3b' }} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ color: '#1e2a3b', fontSize: '28px', fontWeight: '800', margin: 0 }}>Contact Messages</h1>
                    <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px', fontWeight: '500' }}>Manage inquiries from your website visitors</p>
                </div>
                
                <div style={{ position: 'relative', width: '280px' }}>
                    <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 16px 10px 40px', background: '#ffffff',
                            border: '1px solid rgba(30,42,59,0.08)', borderRadius: '12px', fontSize: '14px',
                            color: '#1e2a3b', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s'
                        }}
                        onFocus={e => e.currentTarget.style.border = '1px solid #ffc107'}
                        onBlur={e => e.currentTarget.style.border = '1px solid rgba(30,42,59,0.08)'}
                    />
                </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(30,42,59,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(30,42,59,0.08)' }}>
                                <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>Date</th>
                                <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>Sender</th>
                                <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>Contact</th>
                                <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left' }}>Subject & Message</th>
                                <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'left', whiteSpace: 'nowrap' }}>Status</th>
                                <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '700', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '64px', textAlign: 'center', color: '#64748B' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <Search size={40} color="#cbd5e1" />
                                            <span style={{ fontSize: '15px', fontWeight: '500' }}>No messages found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map(message => (
                                    <tr key={message._id} style={{ 
                                        borderBottom: '1px solid rgba(30,42,59,0.04)', 
                                        transition: 'background 0.2s',
                                        background: message.status === 'unread' ? 'rgba(239, 246, 255, 0.5)' : 'transparent'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = message.status === 'unread' ? 'rgba(239, 246, 255, 0.8)' : '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = message.status === 'unread' ? 'rgba(239, 246, 255, 0.5)' : 'transparent'}
                                    >
                                        <td style={{ padding: '16px 24px', color: '#64748B', whiteSpace: 'nowrap' }}>
                                            {new Date(message.createdAt).toLocaleDateString()}
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ color: '#1e2a3b', fontWeight: '600' }}>{message.name}</div>
                                            {message.wantsInfo && (
                                                <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', background: '#dcfce7', color: '#16a34a', fontSize: '11px', borderRadius: '12px', fontWeight: '600' }}>Info Subscriber</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px', color: '#64748B' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                <Mail size={14} />
                                                <a href={`mailto:${message.email}`} style={{ color: '#1e2a3b', textDecoration: 'none', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#ffc107'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#1e2a3b'}
                                                >{message.email}</a>
                                            </div>
                                            <div style={{ fontSize: '13px' }}>{message.phone}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', maxWidth: '300px' }}>
                                            <div style={{ color: '#1e2a3b', fontWeight: '600', marginBottom: '4px' }}>{message.subject}</div>
                                            <div style={{ color: '#64748B', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{message.message}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {message.status === 'unread' ? (
                                                <span style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Unread</span>
                                            ) : (
                                                <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Read</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                {message.status === 'unread' && (
                                                    <button 
                                                        onClick={() => handleMarkAsRead(message._id)}
                                                        style={{ padding: '8px', background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        title="Mark as Read"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(message._id)}
                                                    style={{ padding: '8px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    title="Delete Message"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminContactMessages;
