import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../components/ConfirmationModal';

describe('ConfirmationModal Component', () => {
  it('should display modal and handle confirmation', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ConfirmationModal isOpen={true} onConfirm={onConfirm} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
