/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useContext } from "react";
import { MyUserContext } from "../../configs/MyContext";

const Info = () => {
    const user = useContext(MyUserContext);

    if (!user) {
        return <p>Please log in to see your information.</p>;
    }

    return (
        <div css={styles.container}>
            <h1>Thông tin cá nhân</h1>
            <div css={styles.avatarSection}>
                <img src={user.avatar} alt={`${user.name}'s avatar`} css={styles.avatar} />
            </div>
            <div css={styles.infoSection}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Address:</strong> {user.Address}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>DOB:</strong> {user.DOB}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

const styles = {
    container: css`
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        padding-top: 100px; /* Adjust based on navbar height */
        background: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    `,
    avatarSection: css`
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    `,
    avatar: css`
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
    `,
    infoSection: css`
        p {
            font-size: 18px;
            margin: 10px 0;
            strong {
                color: #333;
            }
        }
    `
};

export default Info;
