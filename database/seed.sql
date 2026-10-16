-- Dados iniciais de categorias. Itens de exemplo podem ser importados
-- de data/themes.json pelo backend quando a integração for implementada.
INSERT INTO wheel_categories (slug, display_name) VALUES
    ('subjects', 'Substantivo / sujeito'),
    ('verbs', 'Verbo / ação'),
    ('objects', 'Complemento')
ON CONFLICT (slug) DO NOTHING;
