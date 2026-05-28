export default function Footer() {
  return (
    <>
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          padding: '12px 0',
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <p style={{ fontSize: '12px', margin: 0 }}>
          ابزارهای هوشمند برای رشد و کنترل بهتر عملکرد
        </p>
      </footer>

      <div style={{ height: '56px' }} />
    </>
  );
}
