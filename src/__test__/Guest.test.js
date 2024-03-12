import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Guest from '../components/Guest';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('guests')) {
                    return Promise.resolve([
                        { id: 1, name: 'John Doe', email: 'john@example.com', rsvp: 'Pending' }
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
    test('GuestComponent boundary renders without crashing', () => {
        render(<Guest />);
    });

    test('GuestComponent boundary has all form fields and submit button', () => {
        render(<Guest />);
        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('RSVP:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add Guest' })).toBeInTheDocument();
    });

    test('GuestComponent boundary can submit a new guest', async () => {
        render(<Guest />);
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByLabelText('RSVP:'), { target: { value: 'Yes' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Guest' }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    });

    test('GuestComponent boundary displays guests list with RSVP status and buttons', async () => {
        render(<Guest />);
        await waitFor(() => expect(screen.getByText(/John Doe \(john@example.com\) - RSVP: Pending/)).toBeInTheDocument());
        const buttons = screen.getAllByRole('button');
        expect(buttons.some(button => button.textContent === 'Yes')).toBe(true);
        expect(buttons.some(button => button.textContent === 'No')).toBe(true);
    });    

    test('GuestComponent boundary RSVP buttons update guest RSVP status', async () => {
        render(<Guest />);
        fireEvent.click(screen.getByText('Yes'));
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });
});
