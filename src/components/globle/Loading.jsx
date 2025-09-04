import React from 'react'

const Loading = () => {
    return (
        <div className="p-4-400  w-full flex items-center justify-center h-screen">
            <div className="fading-spinner">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`bar bar${i + 1}`}></div>
                ))}
            </div>
        </div>
    )
}

export default Loading