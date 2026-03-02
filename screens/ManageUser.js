import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// ── Firebase config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyCSgjEoSloEwjZwAdfTTqh9LirUyIQ_1Vc',
  authDomain: 'amuser-21773.firebaseapp.com',
  databaseURL: 'https://amuser-21773-default-rtdb.asia-southeast1.firebaseio.com',
  projectId: 'amuser-21773',
  storageBucket: 'amuser-21773.firebasestorage.app',
  messagingSenderId: '183422632328',
  appId: '1:183422632328:web:a37dc4f8d3b4cc5a76fa3d',
  measurementId: 'G-FN7HY7DM4N',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// ── Helpers ──────────────────────────────────────────────────────
function formatDate(val) {
  if (!val) return '—';
  const d = val?.toDate ? val.toDate() : new Date(val);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function shortUID(uid = '') {
  return uid.length > 20 ? uid.slice(0, 20) + '…' : uid;
}

// ── Component ────────────────────────────────────────────────────
export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Realtime listener ──────────────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        showToast('Failed to load users', 'error');
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  // ── Toast ──────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Add user (Firestore only) ──────────────────────────────────
  const handleAddUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    setAdding(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmail.trim(),
        newPassword.trim()
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: newName.trim(),
        email: newEmail.trim(),
        createdAt: serverTimestamp(),
      });

      showToast("User created successfully");
      setShowAddModal(false);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setAdding(false);
    }
  };

  // ── Delete user (Firestore doc) ────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', deleteTarget.id));
      showToast('Account deleted');
      setDeleteTarget(null);
    } catch (e) {
      showToast('Failed to delete: ' + e.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = users.filter(
    (u) =>
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.uid || '').toLowerCase().includes(search.toLowerCase()),
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .mu-wrap { font-family: 'Segoe UI', sans-serif; }

        /* ── Toolbar ── */
        .mu-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .mu-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .mu-search-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          color: #999; font-size: 15px; pointer-events: none;
        }
        .mu-search {
          width: 95%;
          padding: 9px 10px 9px 36px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          background: #fff;
          transition: border-color .2s;
        }
        .mu-search:focus { border-color: #7a1010; }

        .mu-btn-primary {
          background: #7a1010;
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          white-space: nowrap;
          transition: background .2s;
        }
        .mu-btn-primary:hover { background: #5e0c0c; }
        .mu-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

        .mu-btn-icon {
          width: 36px; height: 36px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #666;
          font-size: 16px;
          transition: all .2s;
          flex-shrink: 0;
        }
        .mu-btn-icon:hover { border-color: #7a1010; color: #7a1010; }

        /* ── Table card ── */
        .mu-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
        }

        .mu-table { width: 100%; border-collapse: collapse; }
        .mu-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: #888;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .mu-table td {
          padding: 13px 16px;
          font-size: 13px;
          color: #333;
          border-bottom: 1px solid #f5f5f5;
          vertical-align: middle;
        }
        .mu-table tr:last-child td { border-bottom: none; }
        .mu-table tbody tr:hover { background: #fdf5f5; }

        /* ✅ Scrollable table body (ADDED) */
        .mu-table-wrapper {
          display: flex;
          flex-direction: column;
        }
        .mu-table-body {
          max-height: 520px;      /* change this height if you want */
          overflow-y: auto;
        }
        .mu-table thead {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
        .mu-table-body table {
          display: table;
          width: 100%;
          table-layout: fixed;
        }

        .mu-email { display: flex; align-items: center; gap: 8px; }
        .mu-email-icon {
          width: 26px; height: 26px;
          background: #f5eded;
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          color: #7a1010;
          flex-shrink: 0;
        }
        .mu-uid { font-size: 11px; color: #bbb; font-family: monospace; }

        .mu-delete-btn {
          background: transparent;
          border: none;
          color: #ccc;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 4px;
          font-size: 15px;
          transition: all .2s;
        }
        .mu-delete-btn:hover { color: #7a1010; background: #fef2f2; }

        /* ── Empty / loading ── */
        .mu-empty {
          text-align: center;
          padding: 48px 20px;
          color: #aaa;
          font-size: 13px;
        }
        .mu-spinner {
          width: 20px; height: 20px;
          border: 2px solid #e5e5e5;
          border-top-color: #7a1010;
          border-radius: 50%;
          animation: mu-spin .7s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes mu-spin { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .mu-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 12px 16px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #f0f0f0;
        }

        /* ── Modal ── */
        .mu-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
          animation: mu-fadeIn .2s ease;
        }
        @keyframes mu-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mu-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .mu-modal {
          background: #fff;
          border-radius: 10px;
          padding: 28px;
          width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
          animation: mu-slideUp .25s ease;
        }
        .mu-modal-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }
        .mu-modal-title.danger { color: #7a1010; }

        .mu-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 6px;
        }
        .mu-input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          margin-bottom: 14px;
          box-sizing: border-box;
          transition: border-color .2s;
        }
        .mu-input:focus { border-color: #7a1010; }

        .mu-modal-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .mu-modal-desc strong { color: #333; }

        .mu-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .mu-btn-cancel {
          background: transparent;
          border: 1px solid #ddd;
          color: #666;
          padding: 9px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: all .2s;
        }
        .mu-btn-cancel:hover { border-color: #aaa; color: #333; }

        .mu-btn-danger {
          background: #7a1010;
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: background .2s;
        }
        .mu-btn-danger:hover { background: #7a1010; }
        .mu-btn-danger:disabled { opacity: .6; cursor: not-allowed; }

        /* ── Toast ── */
        .mu-toast {
          position: fixed;
          bottom: 24px; right: 24px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          z-index: 2000;
          box-shadow: 0 8px 24px rgba(0,0,0,.15);
          animation: mu-slideUp .3s ease;
        }
        .mu-toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .mu-toast.error   { background: #fef2f2; border: 1px solid #fecaca; color: #7a1010; }

        /* ── Badge ── */
        .mu-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 500;
          background: #fdf5f5;
          color: #7a1010;
          border: 1px solid #f5d0d0;
        }
      `}</style>

      <div className="mu-wrap">
        {/* Toolbar */}
        <div className="mu-toolbar">
          <div className="mu-search-wrap">
            <span className="mu-search-icon">🔍</span>
            <input
              className="mu-search"
              placeholder="Search by name, email, or UID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="mu-btn-primary" onClick={() => setShowAddModal(true)}>
            + Add User
          </button>
          <button
            className="mu-btn-icon"
            title="Reload"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 600);
            }}
          >
            ↻
          </button>
        </div>

        {/* Table Card */}
        <div className="mu-card">
          {/* ✅ Scroll wrapper (ADDED) */}
          <div className="mu-table-wrapper">
            {/* Header table */}
            <table className="mu-table">
              <thead>
                <tr>
                  <th>Identifier</th>
                  <th>Display Name</th>
                  <th>Created</th>
                  <th>User UID</th>
                  <th></th>
                </tr>
              </thead>
            </table>

            {/* Scrollable body */}
            <div className="mu-table-body">
              <table className="mu-table">
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="mu-empty">
                          <div className="mu-spinner" />
                          Loading users…
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="mu-empty">
                          {search ? `No users matching "${search}"` : 'No users found'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="mu-email">
                            <div className="mu-email-icon">✉</div>
                            <span>{u.email || '—'}</span>
                          </div>
                        </td>
                        <td>{u.displayName || '—'}</td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td className="mu-uid">{shortUID(u.uid || u.id)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="mu-delete-btn"
                            onClick={() => setDeleteTarget(u)}
                            title="Delete account"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer (same as original) */}
            {!loading && (
              <div className="mu-footer">
                <span className="mu-badge">
                  {filtered.length} user{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {showAddModal && (
        <div className="mu-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="mu-modal">
            <div className="mu-modal-title">Add New User</div>
            <label className="mu-label">Display Name</label>
            <input
              className="mu-input"
              placeholder="Juan dela Cruz"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <label className="mu-label">Email Address</label>
            <input
              className="mu-input"
              type="email"
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
            />
            <div className="mu-modal-actions">
              <button className="mu-btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="mu-btn-primary"
                onClick={handleAddUser}
                disabled={adding || !newName.trim() || !newEmail.trim()}
              >
                {adding ? 'Adding…' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="mu-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="mu-modal">
            <div className="mu-modal-title danger">Delete Account</div>
            <p className="mu-modal-desc">
              Are you sure you want to permanently delete the account for{' '}
              <strong>{deleteTarget.email || deleteTarget.displayName}</strong>?
              <br />
              <span style={{ color: '#aaa', fontSize: '12px' }}>This action cannot be undone.</span>
            </p>
            <div className="mu-modal-actions">
              <button className="mu-btn-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="mu-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className={`mu-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}