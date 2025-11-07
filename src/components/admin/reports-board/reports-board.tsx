'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import styles from './reports-board.module.css'

interface Report {
    id: number
    title: string
    description: string
    status: string
}

const columns = [
    { id: 'ZGLOSZONE', title: 'To Accept' },
    { id: 'PRZYJETE', title: 'Accepted' },
    { id: 'W_TRAKCIE', title: 'In Progress' },
    { id: 'ZREALIZOWANE', title: 'Completed' },
]

export default function AdminProblemReports() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/reports', {
                credentials: 'include' // ✅ wysyłamy cookie
            })
            if (!res.ok) throw new Error('Failed to fetch reports')
            const data: Report[] = await res.json()
            setReports(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching reports:', err)
            setReports([])
        } finally {
            setLoading(false)
        }
    }

    const updateReportStatus = async (id: number, newStatus: string) => {
        let action = ''
        switch (newStatus) {
            case 'PRZYJETE': action = 'accept'; break
            case 'W_TRAKCIE': action = 'in_progress'; break
            case 'ZREALIZOWANE': action = 'complete'; break
            default: return
        }

        try {
            const res = await fetch(`/api/reports/${id}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ✅ wysyłamy cookie
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                console.error('Failed to update report status:', errData.error || await res.text())
                return
            }

            // fetch aktualizacji raportów
            fetchReports()
        } catch (err) {
            console.error('Error updating report:', err)
        }
    }

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result
        if (!destination || destination.droppableId === source.droppableId) return

        const id = parseInt(draggableId)
        const newStatus = destination.droppableId
        updateReportStatus(id, newStatus)
    }

    if (loading) return <p>Loading reports...</p>

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Task Board</h1>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.board}>
                    {columns.map(col => (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided) => (
                                <div
                                    className={styles.column}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className={styles.columnTitle}>{col.title}</h2>
                                    {reports
                                        .filter(r => r.status === col.id)
                                        .map((report, index) => (
                                            <Draggable
                                                key={report.id.toString()}
                                                draggableId={report.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className={styles.card}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <strong>{report.title}</strong>
                                                        <p>{report.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}
