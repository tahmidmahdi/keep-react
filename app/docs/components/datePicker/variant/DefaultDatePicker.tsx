'use client'
import { useState } from 'react'
import { DatePicker } from '~/src'

const DefaultDatePicker = () => {
  const [_, setDate] = useState<Date | null>(null)
  return (
    <div className="w-1/3">
      <DatePicker singleDate={setDate} placeholder="Date / Month / Year">
        <DatePicker.SingleDate />
      </DatePicker>
    </div>
  )
}

const DefaultDatePickerCode = `
"use client";
import { useState } from "react";
import { DatePicker } from "keep-react";

export const DatePickerComponent = () => {
  const [date, setDate] = useState(null);
  return (
    <DatePicker singleDate={setDate} placeholder="Date / Month / Year">
      <DatePicker.SingleDate />
    </DatePicker>
  );
}
`

export { DefaultDatePicker, DefaultDatePickerCode }
