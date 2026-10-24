import PropTypes from 'prop-types';

export const STATUS_OPTIONS = [
  { value: 'milik', label: 'Dimiliki' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
];

export const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

export const isValidStatus = (status) =>
  STATUS_OPTIONS.some(({ value }) => value === status);

export const bookShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(STATUS_OPTIONS.map(({ value }) => value)).isRequired,
  createdAt: PropTypes.number,
});
