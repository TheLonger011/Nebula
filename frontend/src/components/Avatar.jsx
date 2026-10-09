export default function Avatar({
                                   src,
                                   label = '',
                                   size = 40,
                                   className = '',
                               }) {
    const classes = ['avatar', className].filter(Boolean).join(' ')

    return (
        <span
            className={classes}
            style={{
                width: size,
                height: size,
                flexBasis: size,
            }}
            aria-label={label || 'Аватар пользователя'}
        >
            {src ? (
                <img
                    className="avatar__image"
                    src={src}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.style.display = 'none'
                    }}
                />
            ) : (
                <span
                    className="icon-placeholder avatar__placeholder"
                    aria-hidden="true"
                />
            )}
        </span>
    )
}