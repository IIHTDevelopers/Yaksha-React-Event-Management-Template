import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Agenda from '../components/Agenda';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('agendas')) {
                    return Promise.resolve([
                        { id: 1, eventId: 1, time: '10:00', title: 'Keynote Speech', speaker: 'Jane Doe', description: 'Opening keynote.' }
                    ]);
                } else if (url.includes('events')) {
                    return Promise.resolve([
                        { id: 1, title: 'Tech Conference 2024' }
                    ]);
                }
                return Promise.resolve([]);
            },
        })
    );
});

afterEach(() => {
    global.fetch.mockClear();
});

describe('boundary', () => {
    test('AgendaComponent boundary renders without crashing', () => {
        render(<Agenda />);
    });

    test('AgendaComponent boundary displays heading', async () => {
        render(<Agenda />);
        expect(await screen.findByText('Manage Event Agendas')).toBeInTheDocument();
    });

    test('AgendaComponent boundary form is rendered and can submit an agenda item', async () => {
        render(<Agenda />);
        await waitFor(() => expect(screen.getByLabelText('Select Event:')).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Select Event:'), { target: { value: 1 } });
        fireEvent.change(screen.getByLabelText('Time:'), { target: { value: '11:00' } });
        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Closing Remarks' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Agenda Item' }));
        expect(global.fetch).toHaveBeenCalled();
    });

    test('AgendaComponent boundary displays agenda items with event titles', async () => {
        render(<Agenda />);
        await waitFor(() => expect(screen.getByText(/\[Tech Conference 2024\] 10:00 - Keynote Speech: Jane Doe/)).toBeInTheDocument());
    });
});
