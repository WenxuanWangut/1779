import React, { useState, useMemo } from 'react'
import Button from '@atlaskit/button'
import Select from '@atlaskit/select'
import Textfield from '@atlaskit/textfield'
import Badge from '@atlaskit/badge'

export default function TicketFilters({ tickets = [], onFilterChange, filters = {} }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || null)
  const [assigneeFilter, setAssigneeFilter] = useState(filters.assignee || null)

  // Get unique assignees from tickets
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

  // Calculate filtered ticket count
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
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 12, 
      marginBottom: 16,
      padding: 16,
      backgroundColor: '#f7f8f9',
      borderRadius: 8,
      border: '1px solid #e1e5e9'
    }}>
      <div style={{ flex: '1 1 300px', minWidth: 200 }}>
        <Textfield
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tickets..."
          isCompact
        />
      </div>
      
      <div style={{ flex: '0 1 200px', minWidth: 150 }}>
        <Select
          value={statusFilter}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="Filter by status"
          isSearchable={false}
        />
      </div>

      {assignees.length > 0 && (
        <div style={{ flex: '0 1 200px', minWidth: 150 }}>
          <Select
            value={assigneeFilter}
            onChange={handleAssigneeChange}
            options={[{ label: 'All Assignees', value: null }, ...assignees]}
            placeholder="Filter by assignee"
            isSearchable={false}
          />
        </div>
      )}

      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge>{filteredCount} tickets</Badge>
          <Button appearance="subtle" onClick={clearFilters} spacing="compact">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

