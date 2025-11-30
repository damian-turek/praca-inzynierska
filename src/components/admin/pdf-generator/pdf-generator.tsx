'use client'

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./pdf-generator.module.css";

interface User {
    id: number;
    first_name: string;
    second_name: string;
    apartment?: { number: string | number } | null;
}

export const AdminBillingCreator = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [charges, setCharges] = useState([
        { label: "Central heating", amount: "" },
        { label: "Water", amount: "" },
        { label: "Garbage", amount: "" },
        { label: "Repair fund", amount: "" }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/admin/users")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
            })
            .catch(() => toast.error("Failed to load users"));
    }, []);

    async function handleSend() {
        if (!userId) {
            toast.error("Select a user first!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/billing/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, charges }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Error generating PDF");
            }

            toast.success("Document generated and added to user inbox!");

            // Reset values
            setUserId(null);
            setCharges(charges.map(c => ({ ...c, amount: "" })));

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <ToastContainer />

            <h2 className={styles.title}>CREATE BILLING DOCUMENT</h2>

            <div className={styles.form}>
                <select
                    value={userId || ""}
                    onChange={e => setUserId(Number(e.target.value))}
                    className={styles.input}
                    disabled={loading}
                >
                    <option value="">Select user</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>
                            {u.first_name} {u.second_name} — apt. {u.apartment?.number ?? "?"}
                        </option>
                    ))}
                </select>

                {charges.map((c, i) => (
                    <input
                        key={i}
                        className={styles.input}
                        placeholder={c.label}
                        value={c.amount}
                        disabled={loading}
                        onChange={e => {
                            const updated = [...charges];
                            updated[i].amount = e.target.value;
                            setCharges(updated);
                        }}
                    />
                ))}

                <button
                    onClick={handleSend}
                    className={styles.submit}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate & Send"}
                </button>
            </div>
        </div>
    );
};
