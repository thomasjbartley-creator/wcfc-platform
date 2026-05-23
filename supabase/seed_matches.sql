-- ============================================================
-- WCFC — Seed all 104 World Cup 2026 matches
-- Run in Supabase SQL Editor
-- ============================================================
INSERT INTO matches (match_number, stage, group_name, home_team, away_team, home_flag, away_flag, kickoff_time, stadium, city) VALUES
-- ── GROUP STAGE — 72 matches ──────────────────────────────
-- Group A
(1,  'group', 'A', 'Mexico',       'South Africa', 'MX', 'ZA', '2026-06-11 19:00:00+00', 'Estadio Azteca',           'Mexico City'),
(2,  'group', 'A', 'South Korea',  'Czechia',      'KR', 'CZ', '2026-06-12 22:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(3,  'group', 'A', 'Mexico',       'South Korea',  'MX', 'KR', '2026-06-16 01:00:00+00', 'AT&T Stadium',             'Dallas'),
(4,  'group', 'A', 'South Africa', 'Czechia',      'ZA', 'CZ', '2026-06-16 22:00:00+00', 'Lumen Field',              'Seattle'),
(5,  'group', 'A', 'Mexico',       'Czechia',      'MX', 'CZ', '2026-06-20 22:00:00+00', 'Estadio Azteca',           'Mexico City'),
(6,  'group', 'A', 'South Africa', 'South Korea',  'ZA', 'KR', '2026-06-20 22:00:00+00', 'MetLife Stadium',          'New York'),
-- Group B
(7,  'group', 'B', 'Canada',       'Bosnia',       'CA', 'BA', '2026-06-12 01:00:00+00', 'BC Place',                 'Vancouver'),
(8,  'group', 'B', 'Qatar',        'Switzerland',  'QA', 'CH', '2026-06-12 19:00:00+00', 'Estadio Akron',            'Guadalajara'),
(9,  'group', 'B', 'Canada',       'Qatar',        'CA', 'QA', '2026-06-16 19:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
(10, 'group', 'B', 'Bosnia',       'Switzerland',  'BA', 'CH', '2026-06-17 01:00:00+00', 'Gillette Stadium',         'Boston'),
(11, 'group', 'B', 'Canada',       'Switzerland',  'CA', 'CH', '2026-06-21 22:00:00+00', 'BC Place',                 'Vancouver'),
(12, 'group', 'B', 'Bosnia',       'Qatar',        'BA', 'QA', '2026-06-21 22:00:00+00', 'Estadio Akron',            'Guadalajara'),
-- Group C
(13, 'group', 'C', 'Brazil',       'Morocco',      'BR', 'MA', '2026-06-13 01:00:00+00', 'Rose Bowl',                'Los Angeles'),
(14, 'group', 'C', 'Haiti',        'Scotland',     'HT', 'GB', '2026-06-13 19:00:00+00', 'Estadio Ciudad de Mexico', 'Mexico City'),
(15, 'group', 'C', 'Brazil',       'Haiti',        'BR', 'HT', '2026-06-17 19:00:00+00', 'Hard Rock Stadium',        'Miami'),
(16, 'group', 'C', 'Morocco',      'Scotland',     'MA', 'GB', '2026-06-17 22:00:00+00', 'MetLife Stadium',          'New York'),
(17, 'group', 'C', 'Brazil',       'Scotland',     'BR', 'GB', '2026-06-21 19:00:00+00', 'Rose Bowl',                'Los Angeles'),
(18, 'group', 'C', 'Morocco',      'Haiti',        'MA', 'HT', '2026-06-21 19:00:00+00', 'Estadio Ciudad de Mexico', 'Mexico City'),
-- Group D
(19, 'group', 'D', 'USA',          'Paraguay',     'US', 'PY', '2026-06-14 01:00:00+00', 'AT&T Stadium',             'Dallas'),
(20, 'group', 'D', 'Australia',    'Türkiye',      'AU', 'TR', '2026-06-14 19:00:00+00', 'Lumen Field',              'Seattle'),
(21, 'group', 'D', 'USA',          'Australia',    'US', 'AU', '2026-06-18 22:00:00+00', 'MetLife Stadium',          'New York'),
(22, 'group', 'D', 'Paraguay',     'Türkiye',      'PY', 'TR', '2026-06-18 19:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
(23, 'group', 'D', 'USA',          'Türkiye',      'US', 'TR', '2026-06-22 22:00:00+00', 'AT&T Stadium',             'Dallas'),
(24, 'group', 'D', 'Australia',    'Paraguay',     'AU', 'PY', '2026-06-22 22:00:00+00', 'Lumen Field',              'Seattle'),
-- Group E
(25, 'group', 'E', 'Germany',      'Curaçao',      'DE', 'CW', '2026-06-14 22:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
(26, 'group', 'E', 'Ivory Coast',  'Ecuador',      'CI', 'EC', '2026-06-15 01:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(27, 'group', 'E', 'Germany',      'Ivory Coast',  'DE', 'CI', '2026-06-18 01:00:00+00', 'MetLife Stadium',          'New York'),
(28, 'group', 'E', 'Curaçao',      'Ecuador',      'CW', 'EC', '2026-06-19 01:00:00+00', 'Rose Bowl',                'Los Angeles'),
(29, 'group', 'E', 'Germany',      'Ecuador',      'DE', 'EC', '2026-06-23 01:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
(30, 'group', 'E', 'Ivory Coast',  'Curaçao',      'CI', 'CW', '2026-06-23 01:00:00+00', 'Gillette Stadium',         'Boston'),
-- Group F
(31, 'group', 'F', 'Netherlands',  'Japan',        'NL', 'JP', '2026-06-15 19:00:00+00', 'Estadio Akron',            'Guadalajara'),
(32, 'group', 'F', 'Sweden',       'Tunisia',      'SE', 'TN', '2026-06-15 22:00:00+00', 'Hard Rock Stadium',        'Miami'),
(33, 'group', 'F', 'Netherlands',  'Sweden',       'NL', 'SE', '2026-06-19 19:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
(34, 'group', 'F', 'Japan',        'Tunisia',      'JP', 'TN', '2026-06-19 22:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
(35, 'group', 'F', 'Netherlands',  'Tunisia',      'NL', 'TN', '2026-06-23 19:00:00+00', 'Estadio Akron',            'Guadalajara'),
(36, 'group', 'F', 'Japan',        'Sweden',       'JP', 'SE', '2026-06-23 19:00:00+00', 'Hard Rock Stadium',        'Miami'),
-- Group G
(37, 'group', 'G', 'Belgium',      'Egypt',        'BE', 'EG', '2026-06-16 01:00:00+00', 'Gillette Stadium',         'Boston'),
(38, 'group', 'G', 'Iran',         'New Zealand',  'IR', 'NZ', '2026-06-16 19:00:00+00', 'BC Place',                 'Vancouver'),
(39, 'group', 'G', 'Belgium',      'Iran',         'BE', 'IR', '2026-06-20 01:00:00+00', 'AT&T Stadium',             'Dallas'),
(40, 'group', 'G', 'Egypt',        'New Zealand',  'EG', 'NZ', '2026-06-20 19:00:00+00', 'Rose Bowl',                'Los Angeles'),
(41, 'group', 'G', 'Belgium',      'New Zealand',  'BE', 'NZ', '2026-06-24 01:00:00+00', 'Gillette Stadium',         'Boston'),
(42, 'group', 'G', 'Iran',         'Egypt',        'IR', 'EG', '2026-06-24 01:00:00+00', 'BC Place',                 'Vancouver'),
-- Group H
(43, 'group', 'H', 'Spain',        'Cabo Verde',   'ES', 'CV', '2026-06-17 01:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(44, 'group', 'H', 'Saudi Arabia', 'Uruguay',      'SA', 'UY', '2026-06-17 19:00:00+00', 'Estadio Azteca',           'Mexico City'),
(45, 'group', 'H', 'Spain',        'Saudi Arabia', 'ES', 'SA', '2026-06-21 01:00:00+00', 'Hard Rock Stadium',        'Miami'),
(46, 'group', 'H', 'Cabo Verde',   'Uruguay',      'CV', 'UY', '2026-06-21 01:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
(47, 'group', 'H', 'Spain',        'Uruguay',      'ES', 'UY', '2026-06-25 01:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(48, 'group', 'H', 'Cabo Verde',   'Saudi Arabia', 'CV', 'SA', '2026-06-25 01:00:00+00', 'Estadio Azteca',           'Mexico City'),
-- Group I
(49, 'group', 'I', 'France',       'Senegal',      'FR', 'SN', '2026-06-18 01:00:00+00', 'BC Place',                 'Vancouver'),
(50, 'group', 'I', 'Iraq',         'Norway',       'IQ', 'NO', '2026-06-18 19:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
(51, 'group', 'I', 'France',       'Iraq',         'FR', 'IQ', '2026-06-22 01:00:00+00', 'MetLife Stadium',          'New York'),
(52, 'group', 'I', 'Senegal',      'Norway',       'SN', 'NO', '2026-06-22 19:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(53, 'group', 'I', 'France',       'Norway',       'FR', 'NO', '2026-06-26 01:00:00+00', 'BC Place',                 'Vancouver'),
(54, 'group', 'I', 'Iraq',         'Senegal',      'IQ', 'SN', '2026-06-26 01:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
-- Group J
(55, 'group', 'J', 'Argentina',    'Algeria',      'AR', 'DZ', '2026-06-19 01:00:00+00', 'AT&T Stadium',             'Dallas'),
(56, 'group', 'J', 'Austria',      'Jordan',       'AT', 'JO', '2026-06-19 22:00:00+00', 'Gillette Stadium',         'Boston'),
(57, 'group', 'J', 'Argentina',    'Austria',      'AR', 'AT', '2026-06-23 22:00:00+00', 'Hard Rock Stadium',        'Miami'),
(58, 'group', 'J', 'Algeria',      'Jordan',       'DZ', 'JO', '2026-06-23 22:00:00+00', 'Rose Bowl',                'Los Angeles'),
(59, 'group', 'J', 'Argentina',    'Jordan',       'AR', 'JO', '2026-06-27 22:00:00+00', 'AT&T Stadium',             'Dallas'),
(60, 'group', 'J', 'Austria',      'Algeria',      'AT', 'DZ', '2026-06-27 22:00:00+00', 'Gillette Stadium',         'Boston'),
-- Group K
(61, 'group', 'K', 'Portugal',     'DR Congo',     'PT', 'CD', '2026-06-20 01:00:00+00', 'Estadio Azteca',           'Mexico City'),
(62, 'group', 'K', 'Uzbekistan',   'Colombia',     'UZ', 'CO', '2026-06-20 22:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
(63, 'group', 'K', 'Portugal',     'Uzbekistan',   'PT', 'UZ', '2026-06-24 19:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
(64, 'group', 'K', 'DR Congo',     'Colombia',     'CD', 'CO', '2026-06-24 22:00:00+00', 'MetLife Stadium',          'New York'),
(65, 'group', 'K', 'Portugal',     'Colombia',     'PT', 'CO', '2026-06-28 22:00:00+00', 'Estadio Azteca',           'Mexico City'),
(66, 'group', 'K', 'DR Congo',     'Uzbekistan',   'CD', 'UZ', '2026-06-28 22:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
-- Group L
(67, 'group', 'L', 'England',      'Croatia',      'GB', 'HR', '2026-06-21 01:00:00+00', 'Rose Bowl',                'Los Angeles'),
(68, 'group', 'L', 'Ghana',        'Panama',       'GH', 'PA', '2026-06-21 22:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(69, 'group', 'L', 'England',      'Ghana',        'GB', 'GH', '2026-06-25 19:00:00+00', 'BC Place',                 'Vancouver'),
(70, 'group', 'L', 'Croatia',      'Panama',       'HR', 'PA', '2026-06-25 22:00:00+00', 'AT&T Stadium',             'Dallas'),
(71, 'group', 'L', 'England',      'Panama',       'GB', 'PA', '2026-06-29 22:00:00+00', 'Rose Bowl',                'Los Angeles'),
(72, 'group', 'L', 'Croatia',      'Ghana',        'HR', 'GH', '2026-06-29 22:00:00+00', 'Hard Rock Stadium',        'Miami'),
-- ── ROUND OF 32 — 16 matches ─────────────────────────────
(73, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-02 22:00:00+00', 'MetLife Stadium',          'New York'),
(74, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-03 01:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(75, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-03 19:00:00+00', 'AT&T Stadium',             'Dallas'),
(76, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-03 22:00:00+00', 'Estadio Azteca',           'Mexico City'),
(77, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-04 01:00:00+00', 'Gillette Stadium',         'Boston'),
(78, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-04 19:00:00+00', 'Hard Rock Stadium',        'Miami'),
(79, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-04 22:00:00+00', 'Rose Bowl',                'Los Angeles'),
(80, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-05 01:00:00+00', 'BC Place',                 'Vancouver'),
(81, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-05 19:00:00+00', 'Arrowhead Stadium',        'Kansas City'),
(82, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-05 22:00:00+00', 'Lincoln Financial Field',  'Philadelphia'),
(83, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-06 01:00:00+00', 'Lumen Field',              'Seattle'),
(84, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-06 19:00:00+00', 'MetLife Stadium',          'New York'),
(85, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-06 22:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(86, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-07 01:00:00+00', 'AT&T Stadium',             'Dallas'),
(87, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-07 19:00:00+00', 'Estadio Azteca',           'Mexico City'),
(88, 'r32', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-07 22:00:00+00', 'Hard Rock Stadium',        'Miami'),
-- ── ROUND OF 16 — 8 matches ──────────────────────────────
(89, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-10 22:00:00+00', 'MetLife Stadium',          'New York'),
(90, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-11 01:00:00+00', 'Rose Bowl',                'Los Angeles'),
(91, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-11 19:00:00+00', 'AT&T Stadium',             'Dallas'),
(92, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-11 22:00:00+00', 'Estadio Azteca',           'Mexico City'),
(93, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-12 01:00:00+00', 'SoFi Stadium',             'Los Angeles'),
(94, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-12 19:00:00+00', 'Gillette Stadium',         'Boston'),
(95, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-12 22:00:00+00', 'BC Place',                 'Vancouver'),
(96, 'r16', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-13 01:00:00+00', 'Hard Rock Stadium',        'Miami'),
-- ── QUARTERFINALS — 4 matches ────────────────────────────
(97,  'qf', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-15 22:00:00+00', 'MetLife Stadium',  'New York'),
(98,  'qf', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-16 01:00:00+00', 'SoFi Stadium',     'Los Angeles'),
(99,  'qf', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-16 22:00:00+00', 'AT&T Stadium',     'Dallas'),
(100, 'qf', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-17 01:00:00+00', 'Rose Bowl',        'Los Angeles'),
-- ── SEMIFINALS — 2 matches ───────────────────────────────
(101, 'sf', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-14 22:00:00+00', 'MetLife Stadium',  'New York'),
(102, 'sf', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-15 01:00:00+00', 'Rose Bowl',        'Los Angeles'),
-- ── THIRD PLACE ──────────────────────────────────────────
(103, 'third', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-18 19:00:00+00', 'AT&T Stadium', 'Dallas'),
-- ── FINAL ────────────────────────────────────────────────
(104, 'final', NULL, 'TBD', 'TBD', NULL, NULL, '2026-07-19 19:00:00+00', 'MetLife Stadium', 'New York');
