import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

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

// ── Constants ────────────────────────────────────────────────────
const PAGE_SIZE = 10; // ✅ Define PAGE_SIZE constant

// ── Helpers ──────────────────────────────────────────────────────
function formatDate(val) {
  if (!val) return '—';
  const d = val?.toDate ? val.toDate() : new Date(val);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(val) {
  if (!val) return '—';
  const d = val?.toDate ? val.toDate() : new Date(val);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adding, setAdding] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // Pagination
  const [pageSize, setPageSize] = useState(PAGE_SIZE); // ✅ Use PAGE_SIZE constant
  const [currentPage, setCurrentPage] = useState(1);

  // ── Realtime listener ──────────────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Hide archived users by default
        const activeOnly = all.filter((u) => !u.archived);

        setUsers(activeOnly);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        showToast('Failed to load users', 'error');
        setLoading(false);
      },
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Toast ──────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Add user (Auth + Firestore) ────────────────────────────────
  const handleAddUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;

    setAdding(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail.trim(), newPassword.trim());

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: newName.trim(),
        email: newEmail.trim(),
        emailVerified: false,
        archived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      showToast('User created successfully');
      setShowAddModal(false);

      // reset form
      setNewName('');
      setNewEmail('');
      setNewPassword('');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  // ── Archive user (Firestore only) ───────────────────────────────
  const handleArchive = async () => {
    if (!archiveTarget) return;
    setArchiving(true);

    try {
      await updateDoc(doc(db, 'users', archiveTarget.id), {
        archived: true,
        archivedAt: serverTimestamp(),
      });

      showToast('User archived');
      setArchiveTarget(null);
    } catch (e) {
      showToast('Failed to archive: ' + e.message, 'error');
    } finally {
      setArchiving(false);
    }
  };

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const name = (u.fullName || u.displayName || '').toLowerCase();
    const uid = (u.id || u.uid || '').toLowerCase();
    return email.includes(s) || name.includes(s) || uid.includes(s);
  });

  // ── Pagination calculations ─────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <>
      <style>{`
        /* ── Global Font ── */
        * {
          font-family: 'Segoe UI', Segoe UI, sans-serif;
        }

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

        /* Scrollable table body */
        .mu-table-wrapper { display: flex; flex-direction: column; }
        .mu-table-body { max-height: 520px; overflow-y: auto; }
        .mu-table thead { display: table; width: 100%; table-layout: fixed; }
        .mu-table-body table { display: table; width: 100%; table-layout: fixed; }

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
        .mu-uid { font-size: 11px; color: #bbb;  }

        .mu-archive-btn {
          background: transparent;
          border: none;
          color: #888888;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 4px;
          font-size: 15px;
          transition: all .2s;
        }
        .mu-archive-btn:hover { color: #7a1010; background: #fef2f2; }

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
          cursor: pointer;
          transition: background .2s;
        }
        .mu-btn-danger:hover { background: #5e0c0c; }
        .mu-btn-danger:disabled { opacity: .6; cursor: not-allowed; }

        /* ── Toast ── */
        .mu-toast {
          position: fixed;
          bottom: 24px; right: 24px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 13px;
          z-index: 2000;
          box-shadow: 0 8px 24px rgba(0,0,0,.15);
          animation: mu-slideUp .3s ease;
        }
        .mu-toast.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .mu-toast.error   { background: #fef2f2; border: 1px solid #fecaca; color: #7a1010; }

        /* ── Badges ── */
        .mu-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid transparent;
        }
        .mu-badge-red {
          background: #fef2f2;
          color: #7a1010;
          border-color: #fecaca;
        }
        .mu-badge-green {
          background: #f0fdf4;
          color: #166534;
          border-color: #bbf7d0;
        }
        .mu-badge-gray {
          background: #f6f7fb;
          color: #666;
          border-color: #e5e7eb;
        }
        
        /* ── Pagination Controls ── */
        .mu-pagination-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-top: 1px solid #f0f0f0;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .mu-pagination-info {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #666;
          font-size: 13px;
        }
        
        .mu-page-size-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .mu-page-size-selector select {
          padding: 6px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
          outline: none;
          background: #fff;
          cursor: pointer;
        }
        
        .mu-page-size-selector select:focus {
          border-color: #7a1010;
        }
        
        .mu-pagination-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .mu-page-btn {
          min-width: 36px;
          height: 36px;
          padding: 0 8px;
          border: 1px solid #e5e5e5;
          background: #fff;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: #555;
          transition: all .15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mu-page-btn:hover:not(:disabled) {
          border-color: #7a1010;
          color: #7a1010;
          background: #fff5f5;
        }
        
        .mu-page-btn.active {
          background: #7a1010;
          color: #fff;
          border-color: #7a1010;
          font-weight: 600;
        }
        
        .mu-page-btn:disabled {
          opacity: .4;
          cursor: not-allowed;
        }
        
        .mu-page-ellipsis {
          padding: 0 4px;
          color: #999;
        }
        
        /* ── Results summary ── */
        .mu-results-summary {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #666;
        }
      `}</style>

      <div className="mu-wrap">
        {/* Toolbar */}
        <div className="mu-toolbar">
          <div className="mu-search-wrap">
            <span className="mu-search-icon">
              <Ionicons name="search-outline" size={16} />
            </span>
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
          <div className="mu-table-wrapper">
            {/* Header table */}
            <table className="mu-table">
              <thead>
                <tr>
                  <th>Identifier</th>
                  <th>Last Active</th>
                  <th>Email Verified</th>
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
                      <td colSpan={6}>
                        <div className="mu-empty">
                          <div className="mu-spinner" />
                          Loading users…
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="mu-empty">{search ? `No users matching "${search}"` : 'No users found'}</div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((u) => {
                      const lastActiveText = formatDateTime(u.updatedAt);
                      const isVerified = u.emailVerified === true;

                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="mu-email">
                              <div className="mu-email-icon">✉</div>
                              <span>{u.email || '—'}</span>
                            </div>
                          </td>

                          <td>{lastActiveText}</td>

                          <td>
                            {u.emailVerified === undefined ? (
                              <span className="mu-badge mu-badge-gray">Unknown</span>
                            ) : isVerified ? (
                              <span className="mu-badge mu-badge-green">Verified</span>
                            ) : (
                              <span className="mu-badge mu-badge-red">Not Verified</span>
                            )}
                          </td>

                          <td>{formatDate(u.createdAt)}</td>

                          <td className="mu-uid">{shortUID(u.id)}</td>

                          <td style={{ textAlign: 'right' }}>
                            <button className="mu-archive-btn" onClick={() => setArchiveTarget(u)} title="Archive user">
                              <Ionicons name="archive-outline" size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!loading && filtered.length > 0 && (
              <div className="mu-pagination-controls">
                <div className="mu-pagination-info">
                  <span className="mu-badge mu-badge-red">
                    {filtered.length} user{filtered.length !== 1 ? 's' : ''}
                  </span>

                  <div className="mu-page-size-selector">
                    <span>Show:</span>
                    <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <span>
                    Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length}
                  </span>
                </div>

                <div className="mu-pagination-buttons">
                  <button
                    className="mu-page-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={safePage === 1}
                    title="First page"
                  >
                    «
                  </button>

                  <button
                    className="mu-page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    title="Previous page"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '…' ? (
                        <span key={`ellipsis-${idx}`} className="mu-page-ellipsis">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className={`mu-page-btn${safePage === p ? ' active' : ''}`}
                          onClick={() => setCurrentPage(p)}
                        >
                          {p}
                        </button>
                      ),
                    )}

                  <button
                    className="mu-page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    title="Next page"
                  >
                    ›
                  </button>

                  <button
                    className="mu-page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safePage === totalPages}
                    title="Last page"
                  >
                    »
                  </button>
                </div>
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

            <label className="mu-label">Full Name</label>
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
            />

            <label className="mu-label">Temporary Password</label>
            <input
              className="mu-input"
              type="password"
              placeholder="Enter a password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
            />

            <div className="mu-modal-actions">
              <button className="mu-btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="mu-btn-primary"
                onClick={handleAddUser}
                disabled={adding || !newName.trim() || !newEmail.trim() || !newPassword.trim()}
              >
                {adding ? 'Adding…' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Archive Confirm Modal ── */}
      {archiveTarget && (
        <div className="mu-overlay" onClick={(e) => e.target === e.currentTarget && setArchiveTarget(null)}>
          <div className="mu-modal">
            <div className="mu-modal-title danger">Archive User</div>
            <p className="mu-modal-desc">
              Archive account for <strong>{archiveTarget.email || archiveTarget.fullName || archiveTarget.id}</strong>?
              <br />
              <span style={{ color: '#aaa', fontSize: '12px' }}>
                This will hide the user from the list (not deleted).
              </span>
            </p>
            <div className="mu-modal-actions">
              <button className="mu-btn-cancel" onClick={() => setArchiveTarget(null)}>
                Cancel
              </button>
              <button className="mu-btn-danger" onClick={handleArchive} disabled={archiving}>
                {archiving ? 'Archiving…' : 'Archive'}
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
