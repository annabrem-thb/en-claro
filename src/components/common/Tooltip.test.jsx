import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Tooltip from './Tooltip.jsx';

const renderTooltip = () =>
  render(
    <Tooltip content="Helpful hint">
      <button>Trigger</button>
    </Tooltip>,
  );

describe('Tooltip (WCAG 1.4.13)', () => {
  it('appears on hover and is not pointer-events-none, so it can be hovered itself', async () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.pointerEnter(screen.getByText('Trigger').parentElement, {
        pointerType: 'mouse',
      });
      fireEvent.mouseEnter(screen.getByText('Trigger').parentElement);
    });

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Helpful hint');
    expect(tooltip.className).not.toContain('pointer-events-none');
  });

  it('is dismissed with Escape', async () => {
    renderTooltip();
    await act(async () => {
      fireEvent.pointerEnter(screen.getByText('Trigger').parentElement, {
        pointerType: 'mouse',
      });
      fireEvent.mouseEnter(screen.getByText('Trigger').parentElement);
    });
    await screen.findByRole('tooltip');

    await act(async () => {
      fireEvent.keyDown(document.body, { key: 'Escape' });
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
