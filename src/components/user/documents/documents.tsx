'use client'

import { useEffect, useState } from "react";
import styles from "./documents.module.css";

interface Doc {
    id: number;
    url: string;
    created_at: string;
}

export default function Documents() {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await fetch("/api/users/billing", {
                    credentials: "include"
                });
                if (!res.ok) throw new Error("Failed to fetch documents");
                const data = await res.json();
                setDocs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setDocs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    if (loading) return <div className={styles.container}>Loading documents...</div>;
    if (!docs.length) return <div className={styles.container}>You have no documents yet.</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Your Documents</h2>
            <div className={styles.docsList}>
                {docs.map(d => (
                    <div key={d.id} className={styles.docCard}>
                        <div className={styles.docInfo}>
                            <span>Billing document</span>
                            <span className={styles.docDate}>
                                from {new Date(d.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className={styles.docLinks}>
                            <a
                                href={d.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.openLink}
                            >
                                Open
                            </a>
                            <a
                                href={d.url}
                                download
                                className={styles.downloadLink}
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
