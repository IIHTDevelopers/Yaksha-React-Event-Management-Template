import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Event from '../components/Event';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.includes('events')) {
                    return Promise.resolve([
                        { id: 1, title: 'Tech Conference 2024', date: '2024-05-15', time: '09:00', venue: 'Convention Center', description: 'A tech conference.' }
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
    test('EventComponent boundary renders without crashing', () => {
        render(<Event />);
    });

    test('EventComponent boundary displays heading', async () => {
        render(<Event />);
        expect(await screen.findByText('Create New Event')).toBeInTheDocument();
    });

    test('EventComponent boundary form is rendered and can submit a new event', async () => {
        render(<Event />);
        await waitFor(() => expect(screen.getByText('Tech Conference 2024 - 2024-05-15 at 09:00, Venue: Convention Center, Description: A tech conference.')).toBeInTheDocument());
        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'New Event' } });
        fireEvent.change(screen.getByLabelText('Date:'), { target: { value: '2024-06-20' } });
        fireEvent.change(screen.getByLabelText('Time:'), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText('Venue:'), { target: { value: 'New Venue' } });
        fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'An exciting new event.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add Event' }));
        expect(global.fetch).toHaveBeenCalledTimes(2); // Initial fetch + post new event
    });

    test('EventComponent boundary displays events list correctly', async () => {
        render(<Event />);
        await waitFor(() => expect(screen.getByText('Tech Conference 2024 - 2024-05-15 at 09:00, Venue: Convention Center, Description: A tech conference.')).toBeInTheDocument());
    });

    test('EventComponent boundary should have a title input field', () => {
        render(<Event />);
        const titleInput = screen.getByLabelText('Title:');
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveAttribute('type', 'text');
        expect(titleInput).toHaveAttribute('name', 'title');
    });

    test('EventComponent boundary should have a date input field', () => {
        render(<Event />);
        const dateInput = screen.getByLabelText('Date:');
        expect(dateInput).toBeInTheDocument();
        expect(dateInput).toHaveAttribute('type', 'date');
        expect(dateInput).toHaveAttribute('name', 'date');
    });

    test('EventComponent boundary should have a time input field', () => {
        render(<Event />);
        const timeInput = screen.getByLabelText('Time:');
        expect(timeInput).toBeInTheDocument();
        expect(timeInput).toHaveAttribute('type', 'time');
        expect(timeInput).toHaveAttribute('name', 'time');
    });

    test('EventComponent boundary should have a venue input field', () => {
        render(<Event />);
        const venueInput = screen.getByLabelText('Venue:');
        expect(venueInput).toBeInTheDocument();
        expect(venueInput).toHaveAttribute('type', 'text');
        expect(venueInput).toHaveAttribute('name', 'venue');
    });

    test('EventComponent boundary should have a description textarea', () => {
        render(<Event />);
        const descriptionTextarea = screen.getByLabelText('Description:');
        expect(descriptionTextarea).toBeInTheDocument();
    });

    test('EventComponent boundary should have an add event button', () => {
        render(<Event />);
        const addButton = screen.getByRole('button', { name: 'Add Event' });
        expect(addButton).toBeInTheDocument();
        expect(addButton).toHaveAttribute('type', 'submit');
    });
});
