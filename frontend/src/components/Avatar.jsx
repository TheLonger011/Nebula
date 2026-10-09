export default function Avatar({ label, size = 36 }) {
    return (
        <div
            className="avatar"
            style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
            {label}
        </div>
    )
}