-- Companiesテーブル作成
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_companies_is_public ON companies(is_public);
CREATE INDEX idx_companies_tenant_id_is_public ON companies(tenant_id, is_public);

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- サンプルレコード挿入
INSERT INTO companies (tenant_id, name, address, phone, email, is_public) VALUES
    ('tenant-001', '株式会社サンプルテック', '東京都千代田区1-1-1', '03-1234-5678', 'info@sample-tech.co.jp', FALSE),
    ('tenant-001', 'サンプルソリューション株式会社', '東京都新宿区2-2-2', '03-2345-6789', 'contact@sample-solution.co.jp', TRUE),
    ('tenant-002', 'エンジニアリング株式会社', '大阪府大阪市3-3-3', '06-3456-7890', 'info@engineering.co.jp', FALSE),
    ('tenant-002', 'システム開発株式会社', '大阪府大阪市4-4-4', '06-4567-8901', 'contact@system-dev.co.jp', TRUE),
    ('tenant-003', 'テクノロジー株式会社', '福岡県福岡市5-5-5', '092-5678-9012', 'info@technology.co.jp', TRUE);
