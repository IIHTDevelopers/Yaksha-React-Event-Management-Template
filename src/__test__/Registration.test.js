import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Registration from '../components/Registration';

beforeEach(() => {
    global.fetch = jest.fn((url) =>
        Promise.resolve({
            json: () => {
                if (url.endsWith('registrations')) {
                    return Promise.resolve([]);
                } else if (url.endsWith('guests')) {
                    return Promise.resolve([
                        { id: 1, name: 'John Doe' }
                    ]);
                } else if (url.endsWith('agendas')) {
                    return Promise.resolve([
                        { id: 1, title: 'React Basics' }
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
    test('RegistrationComponent boundary renders without crashing', () => {
        render(<Registration />);
        expect(screen.getByText('Session Registrations')).toBeInTheDocument();
    });

    test('RegistrationComponent boundary has guest and session dropdowns and a register button', async () => {
        render(<Registration />);
        expect(screen.getByLabelText('Select Guest:')).toBeInTheDocument();
        expect(screen.getByLabelText('Select Session:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    test('RegistrationComponent boundary can submit a new registration', async () => {
        render(<Registration />);
        fireEvent.change(screen.getByLabelText('Select Guest:'), { target: { value: 1 } });
        fireEvent.change(screen.getByLabelText('Select Session:'), { target: { value: 1 } });
        fireEvent.click(screen.getByRole('button', { name: 'Register' }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });

    test('RegistrationComponent boundary displays registrations correctly', async () => {
        global.fetch.mockImplementationOnce(url =>
            Promise.resolve({
                json: () => Promise.resolve([
                    { id: 1, guestId: 1, agendaId: 1, status: 'Registered' }
                ])
            })
        );
        render(<Registration />);
        await waitFor(() => expect(screen.getByText(/John Doe registered for "React Basics"/)).toBeInTheDocument());
    });
});
