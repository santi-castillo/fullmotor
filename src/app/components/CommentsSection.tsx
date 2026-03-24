'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthProvider'
import {
    Comment,
    fetchComments,
    createComment,
    deleteComment,
} from '@/lib/comments'

const MAX_CHARS = 200

function timeAgo(dateStr: string): string {
    const now = Date.now()
    const then = new Date(dateStr).getTime()
    const diff = Math.floor((now - then) / 1000)

    if (diff < 60) return 'hace un momento'
    if (diff < 3600) {
        const m = Math.floor(diff / 60)
        return `hace ${m} ${m === 1 ? 'minuto' : 'minutos'}`
    }
    if (diff < 86400) {
        const h = Math.floor(diff / 3600)
        return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`
    }
    if (diff < 2592000) {
        const d = Math.floor(diff / 86400)
        return `hace ${d} ${d === 1 ? 'día' : 'días'}`
    }
    return new Date(dateStr).toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function Avatar({ user }: { user: Comment['user'] }) {
    if (user.avatarUrl) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
            />
        )
    }
    return (
        <div className="w-8 h-8 rounded-full bg-[var(--surface-highest)] flex items-center justify-center text-xs font-bold text-[var(--foreground-muted)] flex-shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
    )
}

function CommentForm({
    resourceId,
    parentId,
    onSubmit,
    onCancel,
    placeholder,
}: {
    resourceId: string
    parentId?: string
    onSubmit: (comment: Comment) => void
    onCancel?: () => void
    placeholder?: string
}) {
    const { user, token, login } = useAuth()
    const [body, setBody] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    if (!user || !token) {
        return (
            <button
                onClick={login}
                className="w-full py-4 text-sm text-[var(--foreground-muted)] border border-dashed border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
                <span className="material-symbols-outlined text-base align-middle mr-1">login</span>
                Iniciá sesión con Google para comentar
            </button>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const trimmed = body.trim()
        if (!trimmed || !token) return

        setSubmitting(true)
        setError('')
        try {
            const comment = await createComment(resourceId, trimmed, token, parentId)
            setBody('')
            onSubmit(comment)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al publicar')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-3">
                <Avatar user={{ id: user.id, name: user.name, avatarUrl: user.avatarUrl }} />
                <div className="flex-1">
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
                        placeholder={placeholder || 'Escribí tu comentario...'}
                        rows={2}
                        className="w-full px-4 py-3 bg-[var(--surface-mid)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                    />
                    <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${body.length >= MAX_CHARS ? 'text-red-400' : 'text-[var(--foreground-muted)]'}`}>
                            {body.length}/{MAX_CHARS}
                        </span>
                        <div className="flex gap-2">
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-3 py-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={!body.trim() || submitting}
                                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-[#0b1326] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,220,229,0.3)] transition-all"
                            >
                                {submitting ? 'Publicando...' : 'Publicar'}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>
            </div>
        </form>
    )
}

function CommentItem({
    comment,
    resourceId,
    isReply,
    onDelete,
    onReplyAdded,
}: {
    comment: Comment
    resourceId: string
    isReply?: boolean
    onDelete: (id: string, parentId?: string) => void
    onReplyAdded: (parentId: string, reply: Comment) => void
}) {
    const { user, token } = useAuth()
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const isOwn = user?.id === comment.userId

    async function handleDelete() {
        if (!token) return
        setDeleting(true)
        try {
            await deleteComment(resourceId, comment.id, token)
            onDelete(comment.id, comment.parentId)
        } catch (err) {
            console.error('Delete failed:', err)
        } finally {
            setDeleting(false)
        }
    }

    if (comment.deleted) {
        return (
            <div className={`${isReply ? 'ml-11' : ''}`}>
                <div className="flex gap-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--surface-mid)] flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-[var(--foreground-muted)] italic">Comentario eliminado</p>
                    </div>
                </div>
                {/* Still show replies of deleted comments */}
                {comment.replies?.map((reply) => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        resourceId={resourceId}
                        isReply
                        onDelete={onDelete}
                        onReplyAdded={onReplyAdded}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className={`${isReply ? 'ml-11' : ''}`}>
            <div className="flex gap-3 py-3">
                <Avatar user={comment.user} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{comment.user.name || 'Usuario'}</span>
                        <span className="text-xs text-[var(--foreground-muted)]">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm mt-1 text-[var(--foreground)] break-words">{comment.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                        {!isReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">reply</span>
                                Responder
                            </button>
                        )}
                        {isOwn && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-xs text-[var(--foreground-muted)] hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                {deleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showReplyForm && (
                <div className="ml-11 mb-2">
                    <CommentForm
                        resourceId={resourceId}
                        parentId={comment.id}
                        placeholder={`Responder a ${comment.user.name || 'Usuario'}...`}
                        onCancel={() => setShowReplyForm(false)}
                        onSubmit={(reply) => {
                            onReplyAdded(comment.id, reply)
                            setShowReplyForm(false)
                        }}
                    />
                </div>
            )}

            {comment.replies?.map((reply) => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    resourceId={resourceId}
                    isReply
                    onDelete={onDelete}
                    onReplyAdded={onReplyAdded}
                />
            ))}
        </div>
    )
}

export default function CommentsSection({ resourceId }: { resourceId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loadingMore, setLoadingMore] = useState(false)

    const loadComments = useCallback(async (p: number, append = false) => {
        try {
            const res = await fetchComments(resourceId, p)
            setComments((prev) => append ? [...prev, ...res.data] : res.data)
            setLastPage(res.meta.lastPage)
            setTotal(res.meta.total)
            setPage(p)
        } catch (err) {
            console.error('Failed to load comments:', err)
        }
    }, [resourceId])

    useEffect(() => {
        setLoading(true)
        loadComments(1).finally(() => setLoading(false))
    }, [loadComments])

    async function handleLoadMore() {
        setLoadingMore(true)
        await loadComments(page + 1, true)
        setLoadingMore(false)
    }

    function handleNewComment(comment: Comment) {
        setComments((prev) => [comment, ...prev])
        setTotal((t) => t + 1)
    }

    function handleReplyAdded(parentId: string, reply: Comment) {
        setComments((prev) =>
            prev.map((c) =>
                c.id === parentId
                    ? { ...c, replies: [...(c.replies || []), reply] }
                    : c
            )
        )
        setTotal((t) => t + 1)
    }

    function handleDelete(commentId: string, parentId?: string) {
        if (parentId) {
            // Delete a reply: remove from parent's replies
            setComments((prev) =>
                prev.map((c) =>
                    c.id === parentId
                        ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
                        : c
                )
            )
        } else {
            // Soft-delete root comment
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? { ...c, deleted: true, body: 'Comentario eliminado', user: { ...c.user, name: '', avatarUrl: null } }
                        : c
                )
            )
        }
        setTotal((t) => Math.max(0, t - 1))
    }

    return (
        <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--primary)]">forum</span>
                Comentarios
                {total > 0 && (
                    <span className="text-base font-normal text-[var(--foreground-muted)]">({total})</span>
                )}
            </h2>

            {/* New comment form */}
            <div className="mb-8">
                <CommentForm resourceId={resourceId} onSubmit={handleNewComment} />
            </div>

            {/* Comments list */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-[var(--surface-mid)]" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-[var(--surface-mid)] rounded" />
                                <div className="h-3 w-full bg-[var(--surface-mid)] rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10 text-[var(--foreground-muted)]">
                    <span className="material-symbols-outlined text-4xl mb-2 block">chat_bubble_outline</span>
                    <p className="text-sm">Sé el primero en comentar</p>
                </div>
            ) : (
                <div className="divide-y divide-[var(--border)]">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            resourceId={resourceId}
                            onDelete={handleDelete}
                            onReplyAdded={handleReplyAdded}
                        />
                    ))}
                </div>
            )}

            {/* Load more */}
            {page < lastPage && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2 text-sm font-medium rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar más comentarios'}
                    </button>
                </div>
            )}
        </section>
    )
}
