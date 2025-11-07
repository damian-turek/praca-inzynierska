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
    const [spaces, setSpaces] = useState<SharedSpace[]>([]);
    const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);

    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newMaxPlaces, setNewMaxPlaces] = useState<number>(10);

    const [newStart, setNewStart] = useState("");
    const [newEnd, setNewEnd] = useState("");
    const [newPlaces, setNewPlaces] = useState<number>(1);

    useEffect(() => { fetchSpaces(); }, []);
    useEffect(() => { if (selectedSpaceId) fetchReservations(selectedSpaceId); }, [selectedSpaceId]);

    async function fetchSpaces() {
        setLoading(true);
        try {
            const res = await fetch("/api/shared-spaces");
            const data: SharedSpace[] = await res.json();
            setSpaces(data);
            if (!selectedSpaceId && data.length) setSelectedSpaceId(data[0].id);
        } catch {
            toast.error("Error loading spaces");
        } finally {
            setLoading(false);
        }
    }

    // fetchReservations
    async function fetchReservations(spaceId: number) {
        setLoading(true)
        try {
            const res = await fetch(`/api/reservations?shared_space_id=${spaceId}`, {
                credentials: 'include' // ✅ send httpOnly cookie
            });
            if (!res.ok) throw new Error('Error retrieving reservations');
            const data: Reservation[] = await res.json();
            setReservations(data);
        } catch {
            toast.error("Error retrieving reservations");
        } finally {
            setLoading(false);
        }
    }

// handleAddReservation
    async function handleAddReservation(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedSpaceId) return;
        if (!newStart || !newEnd) return toast.error("Provide start and end dates");
        if (newPlaces < 1) return toast.error("Number of places must be at least 1");

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                credentials: 'include', // ✅ include cookie
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shared_space_id: selectedSpaceId,
                    start_time: newStart,
                    end_time: newEnd,
                    places_reserved: newPlaces
                }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Unknown error");
            }
            toast.success("Reservation added successfully");
            setNewStart("");
            setNewEnd("");
            setNewPlaces(1);
            fetchReservations(selectedSpaceId);
        } catch (err: any) {
            toast.error(`Failed to add reservation: ${err.message}`);
        }
    }


    return (
        <div className={styles.adminPanel}>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={styles.content}>
                <aside className={styles.spacesList}>
                    <h3>Spaces list</h3>
                    {loading ? <p>Loading...</p> : (
                        <ul>
                            {spaces.map(s => (
                                <li key={s.id}>
                                    <button onClick={() => setSelectedSpaceId(s.id)}>
                                        {s.name} (max: {s.max_places})
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>

                <div className={styles.reservationsView}>
                    {selectedSpaceId ? (
                        <>
                            <div>
                                <h3>Reservations — {spaces.find(s => s.id === selectedSpaceId)?.name}</h3>
                                {reservations.length === 0 ? <p>No reservations</p> : (
                                    <ul>
                                        {reservations.map(r => (
                                            <li key={r.id}>
                                                {new Date(r.start_time).toLocaleString()} — {new Date(r.end_time).toLocaleString()} ({r.places_reserved} places)
                                            </li>
                                        ))}
                                    </ul>
                                )}</div>

                            <form className={styles.addReservationForm} onSubmit={handleAddReservation}>
                                <h4>Add reservation</h4>
                                <label>Start: <input type="datetime-local" value={newStart} onChange={e => setNewStart(e.target.value)} /></label>
                                <label>End: <input type="datetime-local" value={newEnd} onChange={e => setNewEnd(e.target.value)} /></label>
                                <label>Places: <input type="number" min={1} value={newPlaces} onChange={e => setNewPlaces(Number(e.target.value))} /></label>
                                <button type="submit">Add reservation</button>
                            </form>
                        </>
                    ) : <p>Choose space to see reservations.</p>}
                </div>
            </div>
        </div>
    )
}
