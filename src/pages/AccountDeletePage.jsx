import React from 'react'

const AccountDeletePage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Delete Your Account</h1>

      <p className="text-gray-700 mb-6">
        Deleting your account is a <strong>permanent action</strong>. Once your account is deleted, 
        all your data will be permanently removed from our system. Please read the steps carefully 
        before proceeding.
      </p>

      <h2 className="text-lg font-semibold mb-2">Steps to Delete Your Account:</h2>
      <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
        <li>Open the <strong>Side Drawer</strong> from the app.</li>
        <li>Scroll down to the bottom and click on <strong>Delete Account</strong> button.</li>
        <li>You will be redirected to this page with details of account deletion.</li>
        <li>Confirm your decision to permanently delete the account.</li>
        <li>Once confirmed, your account and all associated data will be permanently deleted.</li>
        <li>You will be logged out immediately after the deletion process.</li>
      </ol>

      <h2 className="text-lg font-semibold mb-2 text-red-500">Important:</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>All your personal data, activity history, and saved content will be permanently removed.</li>
        <li>This action <strong>cannot be undone</strong>.</li>
      </ul>

      <h2 className="text-lg font-semibold mb-2">Account Recovery:</h2>
      <p className="text-gray-700 mb-6">
        If you deleted your account by mistake and want to recover it, please contact our support team.  
        You can send an email to <a href="mailto:author@example.com" className="text-blue-600 underline">author@example.com</a> 
        within <strong>7 days</strong> of deletion.  
        After 7 days, recovery will not be possible.
      </p>
    </div>
  )
}

export default AccountDeletePage
