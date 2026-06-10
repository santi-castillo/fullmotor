'use client'

import { useState, useEffect, useCallback } from 'react'
import { LogIn, Lock, MessageCircle, Reply, Trash2 } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { Button } from './ui/Button'
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
            />
        )
    }
    return (
        <div className="w-8 h-8 rounded-full bg-sunken flex items-center justify-center text-xs font-bold text-muted flex-shrink-0">
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
                className="w-full py-4 text-sm text-muted border border-dashed border-line-strong rounded-[var(--radius-lg)] hover:border-accent hover:text-accent transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
            >
                <LogIn size={15} aria-hidden="true" />
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
                        placeholder={placeholder || 'Dejá tu comentario…'}
                        rows={2}
                        className="tm-textarea"
                        style={{ minHeight: 64 }}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                        <span className={`font-mono text-xs ${body.length >= MAX_CHARS ? 'text-danger' : 'text-faint'}`}>
                            {body.length}/{MAX_CHARS}
                        </span>
                        <div className="flex gap-2">
                            {onCancel && (
                                <Button size="sm" variant="ghost" onClick={onCancel}>
                                    Cancelar
                                </Button>
                            )}
                            <Button size="sm" type="submit" disabled={!body.trim()} loading={submitting}>
                                Publicar
                            </Button>
                        </div>
                    </div>
                    {error && <p className="text-xs text-danger mt-1">{error}</p>}
                </div>
            </div>
        </form>
    )
}

function CommentItem({
    comment,
    resourceId,
    isReply,
    disabled,
    onDelete,
    onReplyAdded,
}: {
    comment: Comment
    resourceId: string
    isReply?: boolean
    disabled?: boolean
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
                    <div className="w-8 h-8 rounded-full bg-sunken flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-muted italic">Comentario eliminado</p>
                    </div>
                </div>
                {/* Still show replies of deleted comments */}
                {comment.replies?.map((reply) => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        resourceId={resourceId}
                        isReply
                        disabled={disabled}
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
                        <span className="text-sm font-semibold text-ink">{comment.user.name || 'Usuario'}</span>
                        <span className="font-mono text-xs text-faint">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm mt-1 text-body break-words">{comment.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                        {!isReply && !disabled && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <Reply size={13} aria-hidden="true" />
                                Responder
                            </button>
                        )}
                        {isOwn && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-xs text-muted hover:text-danger transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <Trash2 size={13} aria-hidden="true" />
                                {deleting ? 'Eliminando…' : 'Eliminar'}
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
                        placeholder={`Responder a ${comment.user.name || 'Usuario'}…`}
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
                    disabled={disabled}
                    onDelete={onDelete}
                    onReplyAdded={onReplyAdded}
                />
            ))}
        </div>
    )
}

export default function CommentsSection({
    resourceId,
    disabled = false,
    disabledReason,
}: {
    resourceId: string
    disabled?: boolean
    disabledReason?: string
}) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loadedFor, setLoadedFor] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loadingMore, setLoadingMore] = useState(false)

    const loading = loadedFor !== resourceId

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
        let cancelled = false
        fetchComments(resourceId, 1)
            .then((res) => {
                if (cancelled) return
                setComments(res.data)
                setLastPage(res.meta.lastPage)
                setTotal(res.meta.total)
                setPage(1)
            })
            .catch((err) => console.error('Failed to load comments:', err))
            .finally(() => {
                if (!cancelled) setLoadedFor(resourceId)
            })
        return () => { cancelled = true }
    }, [resourceId])

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
            <h2 className="font-display text-xl font-bold text-ink mb-6 flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                <MessageCircle size={20} className="text-accent" aria-hidden="true" />
                Comentarios
                {total > 0 && (
                    <span className="font-mono text-base font-normal text-muted">({total})</span>
                )}
            </h2>

            {/* New comment form */}
            <div className="mb-8">
                {disabled ? (
                    <div className="px-4 py-4 text-sm text-center text-muted border border-dashed border-line-strong rounded-[var(--radius-lg)] flex items-center justify-center gap-2">
                        <Lock size={15} aria-hidden="true" />
                        {disabledReason || 'Esta publicación no acepta nuevos comentarios.'}
                    </div>
                ) : (
                    <CommentForm resourceId={resourceId} onSubmit={handleNewComment} />
                )}
            </div>

            {/* Comments list */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-sunken" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-sunken rounded" />
                                <div className="h-3 w-full bg-sunken rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10 text-muted">
                    <MessageCircle size={28} className="mx-auto mb-2 block text-faint" aria-hidden="true" />
                    <p className="text-sm">Sé el primero en comentar</p>
                </div>
            ) : (
                <div className="divide-y divide-hairline">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            resourceId={resourceId}
                            disabled={disabled}
                            onDelete={handleDelete}
                            onReplyAdded={handleReplyAdded}
                        />
                    ))}
                </div>
            )}

            {/* Load more */}
            {page < lastPage && (
                <div className="text-center mt-6">
                    <Button variant="secondary" size="sm" onClick={handleLoadMore} loading={loadingMore}>
                        Cargar más comentarios
                    </Button>
                </div>
            )}
        </section>
    )
}
