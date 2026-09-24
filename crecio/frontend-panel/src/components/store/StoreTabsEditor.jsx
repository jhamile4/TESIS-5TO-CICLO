import { useState } from 'react'
import { Palette, Edit3, Layers, Share2, Copy, Check, QrCode, Download } from 'lucide-react'
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../common/SocialIcons'

export default function StoreTabsEditor({
  colorThemes,
  selectedTheme,
  setSelectedTheme,
  buttonStyles,
  selectedBtnStyle,
  setSelectedBtnStyle,
  fonts,
  selectedFont,
  setSelectedFont,
  form,
  updateForm,
  sections,
  toggleSection,
  copiedLink,
  onCopyLink
}) {
  const [activeTab, setActiveTab] = useState('diseño')

  return (
    <div className="store-editor-card">
      {/* Subtabs */}
      <div className="editor-subtabs">
        <button
          className={`subtab-btn ${activeTab === 'diseño' ? 'active' : ''}`}
          onClick={() => setActiveTab('diseño')}
        >
          <Palette size={14} /> Diseño
        </button>
        <button
          className={`subtab-btn ${activeTab === 'contenido' ? 'active' : ''}`}
          onClick={() => setActiveTab('contenido')}
        >
          <Edit3 size={14} /> Contenido
        </button>
        <button
          className={`subtab-btn ${activeTab === 'secciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('secciones')}
        >
          <Layers size={14} /> Secciones
        </button>
        <button
          className={`subtab-btn ${activeTab === 'compartir' ? 'active' : ''}`}
          onClick={() => setActiveTab('compartir')}
        >
          <Share2 size={14} /> Compartir
        </button>
      </div>

      {/* TAB 1: DISEÑO */}
      {activeTab === 'diseño' && (
        <div className="tab-form-content">
          <div className="form-group-block">
            <label className="block-label">Tema de color</label>
            <div className="color-themes-grid">
              {colorThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`theme-option ${selectedTheme.id === theme.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  <div className="theme-circle" style={{ backgroundColor: theme.bg }}></div>
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group-block">
            <label className="block-label">Estilo de botones</label>
            <div className="button-styles-row">
              {buttonStyles.map((btn) => (
                <button
                  key={btn.id}
                  className={`btn-style-pill ${selectedBtnStyle.id === btn.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBtnStyle(btn)}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-block">
            <label className="block-label">Fuente</label>
            <div className="font-selector-list">
              {fonts.map((f) => (
                <div
                  key={f}
                  className={`font-item ${selectedFont === f ? 'selected' : ''}`}
                  onClick={() => setSelectedFont(f)}
                  style={{ fontFamily: f }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENIDO */}
      {activeTab === 'contenido' && (
        <div className="tab-form-content">
          <div className="field-group">
            <label>Nombre del negocio</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => updateForm('nombre', e.target.value)}
              placeholder="Mi Tienda Crecio"
            />
          </div>

          <div className="field-group">
            <label>Slogan / Descripción corta</label>
            <input
              type="text"
              value={form.slogan}
              onChange={(e) => updateForm('slogan', e.target.value)}
              placeholder="Los mejores productos al mejor precio"
            />
          </div>

          <div className="field-group">
            <label>WhatsApp</label>
            <div className="input-icon-wrap">
              <WhatsAppIcon size={14} className="input-icon text-green" />
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => updateForm('whatsapp', e.target.value)}
                placeholder="+51 999 123 456"
              />
            </div>
          </div>

          <div className="field-group">
            <label>Instagram</label>
            <div className="input-icon-wrap">
              <InstagramIcon size={14} className="input-icon text-pink" />
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => updateForm('instagram', e.target.value)}
                placeholder="@tunegocio"
              />
            </div>
          </div>

          <div className="field-group">
            <label>Facebook</label>
            <div className="input-icon-wrap">
              <FacebookIcon size={14} className="input-icon text-blue" />
              <input
                type="text"
                value={form.facebook}
                onChange={(e) => updateForm('facebook', e.target.value)}
                placeholder="facebook.com/tunegocio"
              />
            </div>
          </div>

          <div className="field-group">
            <label>Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => updateForm('direccion', e.target.value)}
              placeholder="Av. Principal 123, Lima"
            />
          </div>
        </div>
      )}

      {/* TAB 3: SECCIONES */}
      {activeTab === 'secciones' && (
        <div className="tab-form-content">
          <div className="sections-info-note">
            Activa o desactiva las secciones de tu tienda landing page:
          </div>

          <div className="section-switches-list">
            <div className="switch-card-item">
              <div>
                <strong>Portada</strong>
                <small>Banner principal con tu nombre y slogan</small>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sections.portada}
                  onChange={() => toggleSection('portada')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="switch-card-item">
              <div>
                <strong>Catálogo</strong>
                <small>Muestra tus productos destacados</small>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sections.catalogo}
                  onChange={() => toggleSection('catalogo')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="switch-card-item">
              <div>
                <strong>WhatsApp</strong>
                <small>Botón de contacto directo por chat</small>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sections.whatsapp}
                  onChange={() => toggleSection('whatsapp')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="switch-card-item">
              <div>
                <strong>Redes</strong>
                <small>Links a tus redes sociales de la tienda</small>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sections.redes}
                  onChange={() => toggleSection('redes')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="switch-card-item">
              <div>
                <strong>Ubicación</strong>
                <small>Dirección y mapa de tu tienda física</small>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sections.ubicacion}
                  onChange={() => toggleSection('ubicacion')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPARTIR */}
      {activeTab === 'compartir' && (
        <div className="tab-form-content">
          <div className="field-group">
            <label>Tu link público</label>
            <div className="copy-link-box">
              <span>crecio.app/{form.nombre.toLowerCase().replace(/\s+/g, '-')}</span>
              <button onClick={onCopyLink}>
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                {copiedLink ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="field-group">
            <label>Código QR</label>
            <div className="qr-preview-box">
              <div className="qr-code-placeholder">
                <QrCode size={64} className="text-slate" />
              </div>
              <button className="download-qr-btn">
                <Download size={13} /> Descargar QR
              </button>
            </div>
          </div>

          <div className="field-group">
            <label>Compartir en redes</label>
            <div className="share-buttons-grid">
              <button className="share-pill-btn green-share">
                <WhatsAppIcon size={14} /> WhatsApp
              </button>
              <button className="share-pill-btn blue-share">
                <FacebookIcon size={14} /> Facebook
              </button>
              <button className="share-pill-btn pink-share">
                <InstagramIcon size={14} /> Instagram
              </button>
              <button className="share-pill-btn gray-share">
                <Share2 size={14} /> Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
