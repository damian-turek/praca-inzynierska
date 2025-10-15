import React from 'react'

import styles from './add-user.module.css'

export const AddUser = () => {
    return (
        <section className={styles.wrapper}>
            <h2>ADD USER</h2>
            <form>
                <label>
                    <input type="email" name="email" required placeholder="Email" />
                </label>
                <label>
                    <input type="password" name="password" required placeholder="Password" />
                </label>
                <label>
                    <select name="role" required defaultValue="Select Role">
                        <option value="Select Role" disabled>Select Role</option>
                        <option value="admin">ADMIN</option>
                        <option value="resident">USER</option>
                    </select>
                </label>
                <label>
                    <input type="text" name="first_name" required placeholder="First Name" />
                </label>
                <label>
                    <input type="text" name="second_name" required placeholder="Second Name" />
                </label>
                <label>
                    <input type="tel" name="phone_number" required placeholder="Phone Number" />
                </label>
                <label>
                    <select name="role" required defaultValue="Select Role">
                        <option value="Select Role" disabled>Select Apartment ID</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </label>
                <label>
                    <select name="role" required defaultValue="Select Role">
                        <option value="Select Role" disabled>Select Community ID</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </label>
                <button type="submit">Add User</button>
            </form>
        </section>
    )
}