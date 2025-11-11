import React, { useState, useMemo } from 'react'
import Button from '@atlaskit/button/new'
import Select from '@atlaskit/select'
import Textfield from '@atlaskit/textfield'
import Badge from '@atlaskit/badge'
import '../styles/filter.css'

export default function TicketFilters({ tickets = [], onFilterChange, filters = {} }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || null)
  const [assigneeFilter, setAssigneeFilter] = useState(filters.assignee || null)

  const assignees = useMemo(() => {
    const uniqueAssignees = new Set()
    tickets.forEach(ticket => {
      if (ticket.assignee) {
        uniqueAssignees.add(ticket.assignee.id)
      }
    })
    return Array.from(uniqueAssignees).map(id => {
      const ticket = tickets.find(t => t.assignee?.id === id)
      return {
        label: ticket.assignee.name || ticket.assignee.email,
        value: id
      }
    })
  }, [tickets])

  const statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
    { label: "Won't Do", value: 'WONT_DO' }
  ]

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      borderRadius: 10,
      borderColor: state.isFocused ? '#60a5fa' : '#cbd5e1',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.25)' : 'none',
      backgroundColor: '#fff',
      '&:hover': { borderColor: '#60a5fa' }
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 8px'
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 40
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: 6
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: 6
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 24px rgba(2,6,23,0.08)',
      zIndex: 5
    })
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    onFilterChange({ search: query, status: statusFilter?.value, assignee: assigneeFilter?.value })
  }

  const handleStatusChange = (option) => {
    setStatusFilter(option)
    onFilterChange({ search: searchQuery, status: option?.value || null, assignee: assigneeFilter?.value })
  }

  const handleAssigneeChange = (option) => {
    setAssigneeFilter(option)
    onFilterChange({ search: searchQuery, status: statusFilter?.value, assignee: option?.value || null })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter(null)
    setAssigneeFilter(null)
    onFilterChange({ search: '', status: null, assignee: null })
  }

  const hasActiveFilters = searchQuery || statusFilter?.value || assigneeFilter?.value

  const filteredCount = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = !searchQuery ||
        ticket.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter?.value || ticket.status === statusFilter.value
      const matchesAssignee = !assigneeFilter?.value || ticket.assignee?.id === assigneeFilter.value
      return matchesSearch && matchesStatus && matchesAssignee
    }).length
  }, [tickets, searchQuery, statusFilter, assigneeFilter])

  return (
    <div className="filter-card">
      <div className="filter-item wide">
        <Textfield
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tickets..."
        />
      </div>

      <div className="filter-item">
        <Select
          value={statusFilter}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="Filter by status"
          isSearchable={false}
          styles={selectStyles}
          classNamePrefix="tf"
        />
      </div>

      {assignees.length > 0 && (
        <div className="filter-item">
          <Select
            value={assigneeFilter}
            onChange={handleAssigneeChange}
            options={[{ label: 'All Assignees', value: null }, ...assignees]}
            placeholder="Filter by assignee"
            isSearchable={false}
            styles={selectStyles}
            classNamePrefix="tf"
          />
        </div>
      )}

      {hasActiveFilters && (
        <div className="filter-actions">
          <Badge>{filteredCount} tickets</Badge>
          <Button appearance="subtle" onClick={clearFilters} spacing="compact">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}