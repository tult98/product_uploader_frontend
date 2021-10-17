import React from 'react'

const StoreCard = ({ store }) => {
  return (
    <div className="w-2/3 px-12 py-16 mt-12 bg-white rounded-2xl shadow-grayShadow">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <span className="font-medium">Domain name: </span>
          <p className="ml-4 text-red-500">{store.domain_name}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-medium">Assignee:</p>
          <ul className="list-disc list-inside">
            {store.users.map((user) => (
              <li className="" key={user.id}>
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end mt-12">
        <button className="dangerous-btn">Delete</button>
        <button className="ml-4 primary-btn">Details</button>
      </div>
    </div>
  )
}

export default StoreCard
