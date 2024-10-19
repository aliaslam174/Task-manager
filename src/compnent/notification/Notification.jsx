import { notification } from "antd";
import React from 'react'

function Notification({ type, message, description, duration = 3 }) {
  return (
    <>
    {
      notification.success({
        message: message,
        description: description,
        placement: 'topRight',
        duration: duration,  // Auto-close after 3 seconds
      })
    }
    </>
  )
}

export default Notification




