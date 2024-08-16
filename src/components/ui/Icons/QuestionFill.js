const QuestionFill = ({ color }) => (
  <svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 0.833252C2.68629 0.833252 0 3.51954 0 6.83325C0 10.147 2.68629 12.8333 6 12.8333C9.31371 12.8333 12 10.147 12 6.83325C12 3.51954 9.31371 0.833252 6 0.833252ZM6 9.08325C6.31066 9.08325 6.5625 9.33509 6.5625 9.64575V9.65325C6.5625 9.96391 6.31066 10.2158 6 10.2158C5.68934 10.2158 5.4375 9.96391 5.4375 9.65325V9.64575C5.4375 9.33509 5.68934 9.08325 6 9.08325ZM6.43895 3.50149C6.0025 3.41467 5.5501 3.45923 5.13896 3.62952C4.72783 3.79982 4.37643 4.08821 4.12919 4.45822C3.88196 4.82823 3.75 5.26324 3.75 5.70825C3.75 6.01891 4.00184 6.27075 4.3125 6.27075C4.62316 6.27075 4.875 6.01891 4.875 5.70825C4.875 5.48575 4.94098 5.26824 5.0646 5.08324C5.18821 4.89823 5.36391 4.75404 5.56948 4.66889C5.77505 4.58374 6.00125 4.56146 6.21948 4.60487C6.43771 4.64828 6.63816 4.75542 6.79549 4.91276C6.95283 5.07009 7.05997 5.27055 7.10338 5.48878C7.14679 5.707 7.12451 5.9332 7.03936 6.13877C6.95422 6.34434 6.81002 6.52004 6.62502 6.64366C6.44001 6.76727 6.2225 6.83325 6 6.83325C5.85081 6.83325 5.70774 6.89252 5.60225 6.998C5.49676 7.10349 5.4375 7.24657 5.4375 7.39575L5.4375 7.77075C5.4375 8.08141 5.68934 8.33325 6 8.33325C6.26973 8.33325 6.49512 8.1434 6.54983 7.89004C6.79799 7.8275 7.03499 7.72275 7.25003 7.57906C7.62004 7.33183 7.90843 6.98042 8.07873 6.56929C8.24903 6.15816 8.29358 5.70576 8.20677 5.2693C8.11995 4.83284 7.90566 4.43193 7.59099 4.11726C7.27632 3.80259 6.87541 3.5883 6.43895 3.50149Z"
      fill={color || 'var(--artiside-neutral3)'}
    />
  </svg>
);

export default QuestionFill;
