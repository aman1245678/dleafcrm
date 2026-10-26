import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  User,
  Building,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Repeat,
  Plus,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Meeting } from '../../types/crm';
import { api } from '../../services/api';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated?: () => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onMeetingCreated,
}) => {
  const { addMeeting, contacts, accounts } = useCRM();

  // Form Fields matching Screenshots 4 & 5
  const [title, setTitle] = useState('New Meeting');
  const [meetingVenue, setMeetingVenue] = useState('Client location');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [fromDate, setFromDate] = useState('21/10/2026');
  const [fromTime, setFromTime] = useState('02:00 PM');
  const [toDate, setToDate] = useState('21/10/2026');
  const [toTime, setToTime] = useState('03:00 PM');
  const [host, setHost] = useState('Aman kumar');
  const [participants, setParticipants] = useState<string[]>([]);
  const [relatedTo, setRelatedTo] = useState('None');
  const [repeat, setRepeat] = useState('None');
  const [participantsReminder, setParticipantsReminder] = useState('None');
  const [description, setDescription] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState('15');
  const [reminderType, setReminderType] = useState('None');

  // Contact / Host selector
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter meeting title');
      return;
    }

    const newMeetingData: Partial<Meeting> = {
      title: title.trim(),
      fromTime: allDay ? fromDate : `${fromDate} ${fromTime}`,
      toTime: allDay ? toDate : `${toDate} ${toTime}`,
      location,
      meetingVenue,
      allDay,
      host,
      participants: participants.length > 0 ? participants : ['None'],
      relatedRecordName: relatedTo !== 'None' ? relatedTo : undefined,
      description,
      status: 'Scheduled',
    };

    addMeeting(newMeetingData as any);

    try {
      await api.createMeeting(newMeetingData);
    } catch (e) {
      console.error(e);
    }

    if (onMeetingCreated) onMeetingCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header matching Screenshot 4 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Meeting Information</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body matching Screenshots 4 & 5 */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Title (Highlighted input) */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Title</label>
            <div className="col-span-3">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border-b-2 border-blue-600 text-blue-600 font-semibold text-xs focus:outline-hidden bg-blue-50/20"
              />
            </div>
          </div>

          {/* Meeting Venue */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Meeting Venue</label>
            <div className="col-span-3 relative">
              <select
                value={meetingVenue}
                onChange={(e) => setMeetingVenue(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 appearance-none pr-7 cursor-pointer"
              >
                <option value="Client location">Client location</option>
                <option value="Online / Zoom">Online / Zoom</option>
                <option value="Online / Webinar">Online / Webinar</option>
                <option value="Trade Center Convention Hall">Trade Center Convention Hall</option>
                <option value="Conference Auditorium">Conference Auditorium</option>
                <option value="Headquarters Boardroom">Headquarters Boardroom</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Location</label>
            <div className="col-span-3">
              <input
                type="text"
                placeholder=""
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* All day */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">All day</label>
            <div className="col-span-3">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* From */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">From</label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 px-2.5 py-1.5 border-b border-red-500 text-xs font-mono focus:outline-hidden"
              />
              {!allDay && (
                <input
                  type="text"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden"
                />
              )}
            </div>
          </div>

          {/* To */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">To</label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 px-2.5 py-1.5 border-b border-red-500 text-xs font-mono focus:outline-hidden"
              />
              {!allDay && (
                <input
                  type="text"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-hidden"
                />
              )}
            </div>
          </div>

          {/* Host */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Host</label>
            <div className="col-span-3 relative">
              <select
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 appearance-none pr-7 cursor-pointer"
              >
                <option value="Aman kumar">Aman kumar</option>
                <option value="Pooja Sharma">Pooja Sharma</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Participants matching Screenshot 5 */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Participants</label>
            <div className="col-span-3 flex items-center justify-between">
              <span className="text-slate-600 text-xs">
                {participants.length > 0 ? participants.join(', ') : 'None'}
              </span>
              <button
                type="button"
                onClick={() => setShowAddParticipant(!showAddParticipant)}
                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {showAddParticipant && (
            <div className="p-2 border border-slate-200 bg-slate-50 rounded">
              <input
                type="text"
                placeholder="Search contact..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="w-full px-2 py-1 border rounded text-xs bg-white mb-1.5"
              />
              <div className="max-h-24 overflow-y-auto space-y-1">
                {contacts
                  .filter((c) =>
                    `${c.firstName} ${c.lastName}`
                      .toLowerCase()
                      .includes(participantSearch.toLowerCase())
                  )
                  .map((cnt) => {
                    const fullName = `${cnt.firstName} ${cnt.lastName}`;
                    return (
                      <div
                        key={cnt.id}
                        onClick={() => {
                          if (!participants.includes(fullName)) {
                            setParticipants([...participants, fullName]);
                          }
                          setShowAddParticipant(false);
                        }}
                        className="p-1 hover:bg-blue-100 rounded cursor-pointer flex justify-between"
                      >
                        <span>{fullName}</span>
                        <span className="text-blue-600 font-medium">Select</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Related To */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Related To</label>
            <div className="col-span-3 relative">
              <select
                value={relatedTo}
                onChange={(e) => setRelatedTo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 appearance-none pr-7 cursor-pointer"
              >
                <option value="None">None</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Repeat */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Repeat</label>
            <div className="col-span-3 flex items-center justify-between">
              <span className="text-slate-600">{repeat}</span>
              <button
                type="button"
                onClick={() => setRepeat(repeat === 'None' ? 'Every Week' : 'None')}
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                ✏️
              </button>
            </div>
          </div>

          {/* Participants Reminder */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Participants Reminder</label>
            <div className="col-span-3 relative">
              <select
                value={participantsReminder}
                onChange={(e) => setParticipantsReminder(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500 appearance-none pr-7 cursor-pointer"
              >
                <option value="None">None</option>
                <option value="5 minutes before">5 minutes before</option>
                <option value="15 minutes before">15 minutes before</option>
                <option value="1 hour before">1 hour before</option>
                <option value="1 day before">1 day before</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-start gap-2">
            <label className="text-right text-slate-600 font-normal pt-1">Description</label>
            <div className="col-span-3">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Reminder */}
          <div className="grid grid-cols-4 items-center gap-2">
            <label className="text-right text-slate-600 font-normal">Reminder</label>
            <div className="col-span-3 flex items-center gap-2">
              <span className="text-slate-700 font-medium">15</span>
              <span className="text-slate-600">minutes before</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            className="text-blue-600 hover:underline text-xs font-normal cursor-pointer"
          >
            Add more details
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-1.5 bg-[#0F172A] hover:bg-[#EE0979] text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
