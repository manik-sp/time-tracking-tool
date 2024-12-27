'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmployeeForm from '../components/EmployeeForm'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClientComponentClient()

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .order('name')

    if (error) {
      console.error('Error fetching employees:', error)
    } else {
      setEmployees(data)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting employee:', error)
    } else {
      fetchEmployees()
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Employee
      </button>
      {isAdding && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Add New Employee</h2>
          <EmployeeForm
            onSuccess={() => {
              setIsAdding(false)
              fetchEmployees()
            }}
          />
        </div>
      )}
      {editingEmployee && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Edit Employee</h2>
          <EmployeeForm
            employee={editingEmployee}
            onSuccess={() => {
              setEditingEmployee(null)
              fetchEmployees()
            }}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{employee.name}</td>
                <td className="py-3 px-6 text-left">{employee.email}</td>
                <td className="py-3 px-6 text-left">{employee.role}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingEmployee(employee)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

