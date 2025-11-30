'use client'

import React, { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './shared-space.module.css'

interface SharedSpace {
    id: number;
    name: string;
    description?: string | null;
    max_places: number;
}

interface Reservation {
    id: number;
    shared_space_id: number;
    start_time: string;
    end_time: string;
    places_reserved: number;
}

export const SharedSpaceUser = () => {
    const [spaces, setSpaces] = useState<SharedSpace[]>([])
    const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(false)
    const [newStart, setNewStart] = useState("")
    const [newEnd, setNewEnd] = useState("")
    const [newPlaces, setNewPlaces] = useState<number>(1)
    const [availableSpaces, setAvailableSpaces] = useState<{ id: number, name: string, available: number }[]>([])

    useEffect(() => { fetchSpaces() }, [])
    useEffect(() => { if (selectedSpaceId) fetchReservations(selectedSpaceId) }, [selectedSpaceId])

    async function fetchSpaces() {
        setLoading(true)
        try {
            const res = await fetch("/api/shared-spaces")
            const data: SharedSpace[] = await res.json()
            setSpaces(Array.isArray(data) ? data : [])
            if (!selectedSpaceId && data.length) setSelectedSpaceId(data[0].id)
        } catch {
            toast.error("Error loading spaces")
        } finally {
            setLoading(false)
        }
    }

    async function fetchReservations(spaceId: number) {
        setLoading(true)
        try {
            const res = await fetch(`/api/reservations?shared_space_id=${spaceId}`, { credentials: 'include' })
            if (!res.ok) throw new Error("Error retrieving reservations")
            const data: Reservation[] = await res.json()
            setReservations(data)
        } catch {
            toast.error("Error retrieving reservations")
        } finally {
            setLoading(false)
        }
    }

    async function calculateAvailableSpaces(start: string, end: string) {
        if (!start || !end || spaces.length === 0) {
            setAvailableSpaces([])
            return
        }

        const allReservations: Reservation[] = []
        await Promise.all(spaces.map(async space => {
            try {
                const res = await fetch(`/api/reservations?shared_space_id=${space.id}`, { credentials: 'include' })
                if (res.ok) {
                    const r: Reservation[] = await res.json()
                    allReservations.push(...r)
                }
            } catch {}
        }))

        const available = spaces.map(space => {
            const reserved = allReservations
                .filter(r => r.shared_space_id === space.id &&
                    new Date(r.start_time) < new Date(end) &&
                    new Date(r.end_time) > new Date(start)
                )
                .reduce((acc, r) => acc + r.places_reserved, 0)
            return { id: space.id, name: space.name, available: Math.max(space.max_places - reserved, 0) }
        }).filter(s => s.available > 0)

        setAvailableSpaces(available)
        if (selectedSpaceId && !available.find(a => a.id === selectedSpaceId)) {
            setSelectedSpaceId(null)
            setNewPlaces(1)
        }
    }

    async function handleAddReservation(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedSpaceId) return toast.error("Select a space")
        if (!newStart || !newEnd) return toast.error("Provide start and end dates")
        const spaceInfo = availableSpaces.find(s => s.id === selectedSpaceId)
        if (!spaceInfo) return toast.error("Selected space is not available")
        if (newPlaces < 1 || newPlaces > spaceInfo.available) return toast.error(`Choose between 1 and ${spaceInfo.available} places`)

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shared_space_id: selectedSpaceId,
                    start_time: newStart,
                    end_time: newEnd,
                    places_reserved: newPlaces
                }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "Unknown error")
            }
            toast.success("Reservation added successfully")
            setNewStart(""); setNewEnd(""); setNewPlaces(1)
            await fetchReservations(selectedSpaceId)
        } catch (err: any) {
            toast.error(`Failed to add reservation: ${err.message || err}`)
        }
    }

    return (
        <div className={styles.adminPanel}>
            <ToastContainer position="top-right" autoClose={3000} />

            <section className={styles.addReservationForm}>
                <h3>Create reservation</h3>
                <form onSubmit={handleAddReservation}>
                    <div className={styles.datePickers}>
                        <label className={styles.fieldLabel}>Start:
                            <input type="datetime-local" value={newStart} onChange={e => {
                                const v = e.target.value
                                setNewStart(v)
                                calculateAvailableSpaces(v, newEnd)
                            }} />
                        </label>
                        <label className={styles.fieldLabel}>End:
                            <input type="datetime-local" value={newEnd} onChange={e => {
                                const v = e.target.value
                                setNewEnd(v)
                                calculateAvailableSpaces(newStart, v)
                            }} />
                        </label>
                    </div>

                    {availableSpaces.length > 0 ? (
                        <div className={styles.spacesList}>
                            <h4>Available spaces</h4>
                            <ul>
                                {availableSpaces.map(space => (
                                    <li key={space.id}>
                                        <button
                                            type="button"
                                            disabled={space.available <= 0}
                                            onClick={() => { setSelectedSpaceId(space.id); setNewPlaces(1) }}
                                            className={selectedSpaceId === space.id ? styles.active : ''}
                                        >
                                            {space.name} — available: {space.available}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (newStart && newEnd) ? <p>No spaces available for given dates</p> : <p>Select start and end to see availability</p>}

                    {selectedSpaceId && (
                        <div className={styles.placesInput}>
                            <label className={styles.fieldLabel}>Places:
                                <input
                                    type="number"
                                    min={1}
                                    max={availableSpaces.find(s => s.id === selectedSpaceId)?.available || 1}
                                    value={newPlaces}
                                    onChange={e => setNewPlaces(Number(e.target.value))}
                                />
                            </label>
                            <div>
                                <button type="submit" className={styles.actionButton}>Reserve</button>
                            </div>
                        </div>
                    )}
                </form>
            </section>
        </div>
    )
}
