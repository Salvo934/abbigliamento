import { useState } from "react";

export default function Contatti() {
  const [form, setForm] = useState({ nome: "", email: "", messaggio: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: invio messaggio
    alert("Messaggio inviato! Ti risponderemo al più presto.");
    setForm({ nome: "", email: "", messaggio: "" });
  };

  return (
    <div className="page page-contatti">
      <header className="contatti-header">
        <span className="contatti-label">Scrivici</span>
        <h1>Contatti</h1>
        <p className="contatti-intro">
          Hai domande su ordini, resi o sulla collezione? Siamo qui per aiutarti.
        </p>
      </header>

      <div className="contatti-layout">
        <aside className="contatti-info">
          <div className="contatti-card">
            <span className="contatti-card-icon" aria-hidden>✉️</span>
            <h3>Email</h3>
            <p>Rispondiamo entro 24 ore</p>
            <a href="mailto:info@abbigliamento.it">info@abbigliamento.it</a>
          </div>
          <div className="contatti-card">
            <span className="contatti-card-icon" aria-hidden>📞</span>
            <h3>Telefono</h3>
            <p>Lun–Ven, 9:00–18:00</p>
            <a href="tel:+39021234567">+39 02 1234567</a>
          </div>
          <div className="contatti-card">
            <span className="contatti-card-icon" aria-hidden>📍</span>
            <h3>Indirizzo</h3>
            <p>Visita il nostro showroom</p>
            <span>Via Roma 1, 20100 Milano</span>
          </div>
        </aside>

        <section className="contatti-form-section">
          <h2>Inviaci un messaggio</h2>
          <form className="contatti-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contatti-nome">Nome *</label>
              <input
                id="contatti-nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Il tuo nome"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contatti-email">Email *</label>
              <input
                id="contatti-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="la-tua@email.it"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contatti-messaggio">Messaggio *</label>
              <textarea
                id="contatti-messaggio"
                name="messaggio"
                value={form.messaggio}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Come possiamo aiutarti?"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Invia messaggio
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
