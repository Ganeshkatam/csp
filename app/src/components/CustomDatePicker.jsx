import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function padZero(num) {
    return String(num).padStart(2, '0');
}

/**
 * Parses YYYY-MM-DD string into year, month (0-indexed), day
 */
function parseDateString(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return { year: y, month: m, day: d };
}

/**
 * Formats year, month (0-indexed), day into YYYY-MM-DD
 */
function formatToISO(year, month, day) {
    return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

/**
 * Formats YYYY-MM-DD into human-friendly "01 Sep 2026"
 */
function formatHumanDisplay(dateStr) {
    const parsed = parseDateString(dateStr);
    if (!parsed) return '';
    const monthShort = MONTH_NAMES[parsed.month]?.slice(0, 3) || '';
    return `${padZero(parsed.day)} ${monthShort} ${parsed.year}`;
}

export default function CustomDatePicker({
    value = '',
    onChange,
    placeholder = 'Select date...',
    required = false,
    disabled = false,
    id,
    className = '',
    minYear = 2020,
    maxYear = 2035
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const parsedValue = parseDateString(value);
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    // View state for navigating months
    const [viewYear, setViewYear] = useState(parsedValue ? parsedValue.year : todayYear);
    const [viewMonth, setViewMonth] = useState(parsedValue ? parsedValue.month : todayMonth);

    // Sync view year/month when value changes externally
    useEffect(() => {
        if (parsedValue) {
            setViewYear(parsedValue.year);
            setViewMonth(parsedValue.month);
        }
    }, [value]);

    // Close on click outside or Escape
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
    };

    const handleSelectDay = (day) => {
        const iso = formatToISO(viewYear, viewMonth, day);
        if (onChange) onChange(iso);
        setIsOpen(false);
    };

    const handleSelectToday = () => {
        const iso = formatToISO(todayYear, todayMonth, todayDay);
        setViewYear(todayYear);
        setViewMonth(todayMonth);
        if (onChange) onChange(iso);
        setIsOpen(false);
    };

    const handleClear = (e) => {
        if (e) e.stopPropagation();
        if (onChange) onChange('');
        setIsOpen(false);
    };

    // Calculate calendar grid days
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const calendarCells = [];

    // Previous month filler days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        calendarCells.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            monthOffset: -1
        });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        calendarCells.push({
            day: d,
            isCurrentMonth: true,
            monthOffset: 0
        });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = (7 - (calendarCells.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
        calendarCells.push({
            day: n,
            isCurrentMonth: false,
            monthOffset: 1
        });
    }

    // Generate year range for quick selector
    const years = [];
    for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
    }

    return (
        <div 
            className={`custom-datepicker-container ${className} ${isOpen ? 'is-open' : ''}`}
            ref={containerRef}
        >
            <div 
                className="custom-datepicker-trigger"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                id={id}
            >
                <div className="custom-datepicker-trigger-content">
                    <Calendar size={15} className="custom-datepicker-icon" aria-hidden="true" />
                    <span className={`custom-datepicker-text ${value ? 'has-val' : 'is-placeholder'}`}>
                        {value ? formatHumanDisplay(value) : placeholder}
                    </span>
                </div>

                <div className="custom-datepicker-actions">
                    {value && !required && !disabled && (
                        <button
                            type="button"
                            className="custom-datepicker-clear-btn"
                            onClick={handleClear}
                            title="Clear date"
                            aria-label="Clear date"
                        >
                            <X size={13} aria-hidden="true" />
                        </button>
                    )}
                    <span className="custom-datepicker-raw-badge">
                        {value ? value : 'YYYY-MM-DD'}
                    </span>
                </div>
            </div>

            {/* Hidden native input for form validation */}
            <input 
                type="hidden" 
                value={value || ''} 
                required={required} 
            />

            {/* Calendar Popup Dropdown */}
            {isOpen && (
                <div className="custom-datepicker-popup" role="dialog" aria-modal="true">
                    {/* Header: Month / Year Navigation */}
                    <div className="custom-datepicker-header">
                        <button 
                            type="button" 
                            className="custom-datepicker-nav-btn"
                            onClick={handlePrevMonth}
                            title="Previous month"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={16} aria-hidden="true" />
                        </button>

                        <div className="custom-datepicker-month-year">
                            <select 
                                value={viewMonth}
                                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                                className="custom-datepicker-select"
                                aria-label="Select month"
                            >
                                {MONTH_NAMES.map((m, idx) => (
                                    <option key={m} value={idx}>{m}</option>
                                ))}
                            </select>

                            <select 
                                value={viewYear}
                                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                                className="custom-datepicker-select"
                                aria-label="Select year"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="button" 
                            className="custom-datepicker-nav-btn"
                            onClick={handleNextMonth}
                            title="Next month"
                            aria-label="Next month"
                        >
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Day-of-week header row */}
                    <div className="custom-datepicker-weekdays">
                        {DAYS_OF_WEEK.map(d => (
                            <span key={d} className="custom-datepicker-weekday">{d}</span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="custom-datepicker-grid">
                        {calendarCells.map((cell, idx) => {
                            if (!cell.isCurrentMonth) {
                                return (
                                    <span key={idx} className="custom-datepicker-day out-of-month">
                                        {cell.day}
                                    </span>
                                );
                            }

                            const isSelected = parsedValue && 
                                parsedValue.year === viewYear && 
                                parsedValue.month === viewMonth && 
                                parsedValue.day === cell.day;

                            const isToday = todayYear === viewYear && 
                                todayMonth === viewMonth && 
                                todayDay === cell.day;

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`custom-datepicker-day in-month ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                                    onClick={() => handleSelectDay(cell.day)}
                                    aria-selected={isSelected}
                                    aria-current={isToday ? 'date' : undefined}
                                >
                                    <span>{cell.day}</span>
                                    {isToday && !isSelected && (
                                        <span className="today-indicator-dot" aria-hidden="true"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer Controls */}
                    <div className="custom-datepicker-footer">
                        <button
                            type="button"
                            className="custom-datepicker-action-link"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            className="custom-datepicker-action-link link-today"
                            onClick={handleSelectToday}
                        >
                            Today ({padZero(todayDay)} {MONTH_NAMES[todayMonth].slice(0, 3)})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
