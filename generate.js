const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'index.html');

function readFile(name) {
  const p = path.join(BASE, name);
  if (!fs.existsSync(p)) return '(file not found: ' + name + ')';
  return fs.readFileSync(p, 'utf-8').trim();
}

function extractDirect(name) {
  const content = readFile(name);
  const suffixMatch = content.match(/STYLE SUFFIX[^']*'([^']+)'/);
  const negMatch = content.match(/NEGATIVE[^']*'([^']+)'/);
  const suffix = suffixMatch ? suffixMatch[1] : '';
  const neg = negMatch ? negMatch[1] : '';
  return `[Describe your scene here]. ${suffix} ${neg}`;
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const styles = [
  // PAINTING
  { name:'Monet', tag:'painting', badge:'green', label:'Stable', tagLabel:'Painting',
    desc:'French Impressionism. No outlines &mdash; edges are colour meeting colour. Broken comma-dab brushstrokes of pure pigment. Coloured shadows in violet and blue. Light is the true subject. Vibrant pure palette, never muddy.',
    descRu:'Французский импрессионизм. Никаких контуров — край там, где встречаются два цвета. Разбитые мазки чистого пигмента. Цветные тени. Свет — главный герой.',
    longFile:'slay_monet_long.txt', shortFile:'slay_monet_short.txt', images:['monet.jpg','monet2.jpg','monet3.jpg'] },
  { name:'Manet', tag:'painting', badge:'yellow', label:'Experimental', tagLabel:'Painting',
    desc:'Realist/proto-impressionist. Flat taches of colour, bold blacks, direct confrontational gaze. Modern life rendered with unflinching directness. The visible brushstroke as a statement.',
    descRu:'Реализм / прото-импрессионизм. Плоские пятна цвета, смелые чёрные, прямой конфронтационный взгляд. Видимый мазок как высказывание.',
    longFile:'slay_manet_long.txt', shortFile:'slay_manet_short.txt', images:['manet_short.jpg','manet_short2.jpg'] },
  { name:'Van Gogh', tag:'painting', badge:'green', label:'Stable', tagLabel:'Painting',
    desc:'Post-Impressionism. Thick impasto paint, bold swirling directional strokes. The brushwork IS the emotion. Intense saturated colour exaggerated for emotional truth. Everything pulses with inner life. Complementary colour contrasts.',
    descRu:'Пост-импрессионизм. Густое импасто, закрученные направленные мазки. Мазок И ЕСТЬ эмоция. Насыщенные цвета, усиленные ради эмоциональной правды.',
    longFile:'slay_vangogh_long.txt', shortFile:'slay_vangogh_short.txt', images:['van gogh.jpg','van gogh2.jpg','van gogh3.jpg','van gogh4.jpg'] },
  { name:'Serov', tag:'painting', badge:'yellow', label:'Experimental', tagLabel:'Painting',
    desc:'Russian impressionist portrait. Fresh window light, psychological presence, the weight of a person who exists beyond the frame. Valentin Serov tradition &mdash; luminous natural skin, restrained palette with subtle warmth.',
    descRu:'Русский импрессионистический портрет. Свежий свет из окна, психологическое присутствие. Валентин Серов — светящаяся кожа, сдержанная палитра.',
    longFile:'slay_serov_long.txt', shortFile:'slay_serov_short.txt', images:['serov.jpg','\u0441\u0435\u0440\u043e\u0432.jpg','\u0441\u0435\u0440\u043e\u04322.jpg','\u0441\u0435\u0440\u043e\u04323.jpg','\u0441\u0435\u0440\u043e\u04324.jpg','\u0441\u0435\u0440\u043e\u04325.jpg','\u0441\u0435\u0440\u043e\u04326.jpg','\u0441\u0435\u0440\u043e\u04327.jpg','\u0441\u0435\u0440\u043e\u04328.jpg','\u0441\u0435\u0440\u043e\u04329.jpg','\u0441\u0435\u0440\u043e\u043210.jpg','\u0441\u0435\u0440\u043e\u043211.jpg','\u0441\u0435\u0440\u043e\u043212.jpg','\u0441\u0435\u0440\u043e\u043213.jpg','\u0441\u0435\u0440\u043e\u043214.jpg'] },
  { name:'Rembrandt', tag:'painting', badge:'green', label:'Stable', tagLabel:'Painting',
    desc:'Dutch Golden Age chiaroscuro. Single warm lamp, deep warm shadows. Figures emerge from near-darkness into golden light. Thick impasto in lit areas, thin glazes in shadow. Faces carry the weight of entire lifetimes.',
    descRu:'Голландский Золотой Век, кьяроскуро. Одна тёплая лампа, глубокие тени. Фигуры проступают из тьмы в золотой свет. Лица несут вес целых жизней.',
    longFile:'slay_rembrandt_long.txt', shortFile:'slay_rembrandt_short.txt', images:['\u0440\u0435\u043c\u0431\u0440\u0430\u043d\u0434\u0442.jpg','\u0440\u0435\u043c\u0431\u0440\u0430\u043d\u0434\u04422.jpg','\u0440\u0435\u043c\u0431\u0440\u0430\u043d\u0434\u04423.jpg','\u0440\u0435\u043c\u0431\u0440\u0430\u043d\u0434\u04424.jpg'] },
  { name:'Repin', tag:'painting', badge:'green', label:'Stable', tagLabel:'Painting',
    desc:'Russian realist oil painting. Ilya Repin tradition &mdash; psychological depth, social weight, the human condition rendered in oil. Every face tells a story. Rich earthy palette with dramatic natural lighting.',
    descRu:'Русская реалистическая масляная живопись. Традиция Ильи Репина — психологическая глубина, вес человеческого существования. Каждое лицо рассказывает историю.',
    longFile:'slay_repin_long.txt', shortFile:'slay_repin_short.txt', images:['repin.jpg','repin_short.jpg','REPIN2.jpg','REPIN3.jpg','repin4.jpg','repin5.jpg','repin6.jpg','repin7.jpg'] },
  { name:'Klimt', tag:'painting', badge:'green', label:'Stable', tagLabel:'Painting',
    desc:'Vienna Secession gold leaf painting. Luminous semi-realistic faces and hands &mdash; everything else dissolves into flat ornamental pattern fields. Gold, mosaic tiles, spirals, geometric shapes. The body disappears into pattern; only the face remains real.',
    descRu:'Венский сецессион, золотая живопись. Реалистичные лица и руки — всё остальное растворяется в плоских орнаментальных узорах. Золото, мозаика, спирали.',
    longFile:'slay_klimt_long.txt', shortFile:'slay_klimt_short.txt', images:['klimt.jpg','klimt2.jpg','klimt3.jpg','klimt4.jpg'] },

  // ILLUSTRATION
  { name:'Dark Fantasy', tag:'illustration', badge:'green', label:'Stable', tagLabel:'Illustration',
    desc:'Digital oil painting, prestige novel cover quality. Rich painterly texture, visible brushwork, deep dramatic shadows, atmospheric lighting. Brandon Sanderson / ACOTAR cover art energy. Six lighting types, five mood palettes.',
    descRu:'Цифровая масляная живопись, качество обложки фэнтези-романа. Богатая текстура, видимые мазки, глубокие тени, атмосферное освещение. Энергия обложек Сандерсона и ACOTAR.',
    longFile:'slay_darkfantasy_long.txt', shortFile:'slay_darkfantasy_short.txt', images:['dark_fantasy.jpg','dark_fantasy2.jpg','dark_fantasy3.jpg'] },
  { name:'Classic Fantasy', tag:'illustration', badge:'green', label:'Stable', tagLabel:'Illustration',
    desc:'Larry Elmore, Keith Parkinson, TSR D&amp;D book cover era (1980s-90s). Rich oil on canvas, warm lush saturated palette, heroic flattering light. Romantic fantasy &mdash; beautiful even in danger. Gold, forest green, royal blue, firelight orange.',
    descRu:'Larry Elmore, Keith Parkinson, обложки книг D&D эпохи TSR (1980-90е). Масло на холсте, тёплая насыщенная палитра, героический свет. Романтическое фэнтези — красиво даже в опасности.',
    longFile:'slay_classicfantasy_long.txt', shortFile:'slay_classicfantasy_short.txt', images:['dndclassic.jpg','dndclassic2.jpg','dndclassic3.jpg','dndclassic4.jpg','dndclassic_short.jpg','dndclassic_short2.jpg','dndclassic_short3.jpg'] },
  { name:'Horror Illustration', tag:'illustration', badge:'green', label:'Stable', tagLabel:'Illustration',
    desc:'Bernie Wrightson, Brom tradition. Rich oil paint with visible confident brushstrokes. Extreme chiaroscuro &mdash; 70% of the image in shadow. Impasto highlights, deep warm-brown shadows, single harsh dramatic light source carving form from darkness.',
    descRu:'Традиция Bernie Wrightson, Brom. Масло с видимыми уверенными мазками. Экстремальное кьяроскуро — 70% картинки в тени. Единственный жёсткий источник света вырезает форму из тьмы.',
    longFile:'slay_horror_long.txt', shortFile:'slay_horror_short.txt', images:['horror.jpg','horror2.jpg','horror3.jpg','horror4.jpg','horror5.jpg','horror6.jpg','horror7.jpg','horror8.jpg','horror9.jpg','horror10.jpg','horror11.jpg'] },
  { name:'Art Nouveau (Mucha)', tag:'illustration', badge:'green', label:'Stable', tagLabel:'Illustration',
    desc:'Alphonse Mucha inspired. Central figure with ornamental botanical border of flowers, vines, foliage. Decorative halo arch. Thin confident lineart, pastel palette with gold leaf accents. Hair flowing into the botanical frame. Border plants reflect scene emotion.',
    descRu:'В духе Альфонса Мухи. Фигура в центре с ботанической орнаментальной рамкой из цветов и лоз. Пастельная палитра с золотыми акцентами. Волосы вплетаются в рамку.',
    longFile:'slay_artnouveau_long.txt', shortFile:'slay_artnouveau_short.txt', images:['\u0430\u0440\u043d\u0443\u0432\u043e_1.jpg','\u0430\u0440\u043d\u0443\u0432\u043e_2.jpg','\u0430\u0440\u043d\u0443\u0432\u043e_3.jpg'] },
  { name:'Bilibin v3', tag:'illustration', badge:'yellow', label:'Experimental', tagLabel:'Illustration',
    desc:'Ivan Bilibin Russian fairy tale illustration &mdash; ink outline + watercolour wash. Atmospheric depth, muted naturalistic palette. No border version. Ornament only on costumes and architecture. v3 after multiple iterations fixing the "coloring book" problem.',
    descRu:'Иван Билибин, русская сказочная иллюстрация — контур тушью + акварельная размывка. Атмосферная глубина, приглушённая палитра. Версия без рамки.',
    longFile:'slay_bilibin3_long.txt', shortFile:'slay_bilibin3_short.txt', images:['bilibin.jpg','bilibin1.jpg','blibin.jpg'] },
  { name:'Pin-up', tag:'illustration', badge:'green', label:'Stable', tagLabel:'Illustration',
    desc:'Gil Elvgren, Alberto Vargas tradition. Smooth luminous oil/gouache, seamlessly blended. Warm glowing skin, vivid flat background. Playful caught-moment pose, engaged expression. The figure is everything &mdash; background is subordinate.',
    descRu:'Традиция Gil Elvgren, Alberto Vargas. Гладкое масло/гуашь, светящаяся кожа, яркий плоский фон. Игривая поза пойманного момента. Фигура — это всё.',
    longFile:'slay_pinup_long.txt', shortFile:'slay_pinup_short.txt', images:['pinup.jpg','pinup2.jpg','pinup3.jpg','pinup4.jpg','pinup5.jpg','pinup6.jpg','pinup7.jpg','pinup8.jpg','pinup9.jpg','pinup10.jpg','pinup11.jpg'] },

  // FILM & PHOTO
  { name:'Cinematic Realism', tag:'film', badge:'green', label:'Stable', tagLabel:'Film & Photo',
    desc:'Literal frame from a prestige film. Three director substyles: Kubrick (cold symmetric one-point), Tarantino (warm saturated detail-loving), Nolan (blue-amber IMAX scale). Film grain, selective DoF, practical light sources. Photorealistic.',
    descRu:'Буквальный кадр из фильма. Три режиссёрских подстиля: Кубрик (холодная симметрия), Тарантино (тёплая насыщенность), Нолан (синий-янтарь IMAX).',
    longFile:'slay_cinematic_long.txt', shortFile:'slay_cinematic_short.txt', images:['cinematic_realism_short.jpg','cinematic_realism_short_2.jpg','cinematic_realism3434.jpg','cinematic_realism_short_3.jpg'] },
  { name:'Cinematic Art', tag:'film', badge:'green', label:'Stable', tagLabel:'Film & Photo',
    desc:'Same three director substyles &mdash; but as illustrated semi-realism art. Movie concept art, painted film posters, Drew Struzan quality. Three registers: tight digital paint, expressive oil, graphic painted poster.',
    descRu:'Те же три режиссёра — но как иллюстрированный семиреализм. Концепт-арт фильма, рисованные постеры. Три регистра техники.',
    longFile:'slay_cinematicart_long.txt', shortFile:'slay_cinematicart_short.txt', images:['cinematic_art.jpg','cinematic_art_long.jpg','cinematic_art_long2.jpg','cinematic_art_long3.jpg','cinematic_art_long4.jpg'] },
  { name:'Film Noir', tag:'film', badge:'green', label:'Stable', tagLabel:'Film & Photo',
    desc:'Classic 1940s-50s noir. Near-monochrome black and white. Extreme chiaroscuro, venetian blind shadows, wet streets, smoke in light beams. Hard shadow lines cutting across faces. Organic film grain.',
    descRu:'Классический нуар 1940-50х. Почти монохром, чёрно-белый. Экстремальное кьяроскуро, тени от жалюзи, мокрые улицы, дым в лучах света. Жёсткие тени на лицах. Плёночное зерно.',
    longFile:'slay_noir_long.txt', shortFile:'slay_noir_short.txt', images:['\u043d\u0443\u0430\u0440.jpg','\u043d\u0443\u0430\u04402.jpg','\u043d\u0443\u0430\u04403.jpg','\u043d\u0443\u0430\u04404.jpg','noir.jpg','noir2.jpg','noir3.jpg','noir4.jpg','noir5.jpg','noir6.jpg'] },
  { name:'Sin City', tag:'film', badge:'yellow', label:'Experimental', tagLabel:'Film & Photo',
    desc:"Frank Miller's extreme black and white. Mostly pure black with white carved from darkness. ONE selective colour element per image: red blood, golden hair, blue eyes. Ink-splash aesthetic. Noir pushed to graphic novel extreme.",
    descRu:'Экстремальный чёрно-белый Фрэнка Миллера. Почти весь чёрный с белым, вырезанным из тьмы. ОДИН цветной элемент: красная кровь, золотые волосы, синие глаза. Нуар в графическом романе.',
    longFile:'slay_sincity_long.txt', shortFile:'slay_sincity_short.txt', images:['sincity.jpg','cincity2.jpg'] },
  { name:'Webcam / Candid Photo', tag:'film', badge:'green', label:'Stable', tagLabel:'Film & Photo',
    desc:'Candid snapshot from a cheap digital camera or webcam — mid-2000s quality. JPEG artifacts, noise, bad white balance. Imperfect candid composition. Natural body language — caught mid-moment, not posing. Solves the stiff pose problem.',
    descRu:'Кандидное фото с дешёвой камеры/вебкамеры. JPEG артефакты, шум, плохой баланс белого. Кривая композиция. Естественные позы — пойман в моменте. Решает проблему деревянных поз.',
    longFile:'slay_webcam_long.txt', shortFile:'slay_webcam_short.txt', images:['\u0412\u0415\u0411\u041a\u0410\u041c.jpg','WEBCAM.jpg','\u0432\u0435\u0431\u043a\u0430\u043c2.jpg','webcam2.jpg'] },

  // VIDEO GAMES
  { name:'Oldschool Lowpoly Game', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'Early 2000s Bethesda RPG engine. Low-polygon 3D models, blurry stretched textures, angular geometric faces. Simple flat lighting. Muted earthy palette: ash grey, mud brown, dark green. Atmospheric distance fog. That Morrowind jank charm.',
    descRu:'Движок Bethesda начала 2000х. Лоу-поли модели, растянутые текстуры, угловатые лица. Простое освещение. Пепельные, коричневые, болотные тона. Туман дальности.',
    longFile:'slay_morrowind_long.txt', shortFile:'slay_morrowind_short.txt', images:['lowpoly game.jpg','lowpoly game2.jpg'] },
  { name:'Skyrim', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'Bethesda Creation Engine. Mid-fidelity 3D &mdash; game-quality, not cinematic. Desaturated cold steel-blue exteriors, warm amber-gold firelight interiors. Real-time shadows, game-res textures. Heavy fur, pitted iron, worn leather. Nordic weight.',
    descRu:'Creation Engine. Мид-фиделити 3D — игровое качество. Холодная сталь-голубая палитра снаружи, тёплый янтарь огня внутри. Мех, железо, кожа, камень.',
    longFile:'slay_skyrim_long.txt', shortFile:'slay_skyrim_short.txt', images:['skyrim.jpg','skyrim_1.jpg','skyrim2.jpg'] },
  { name:"Baldur's Gate 3", tag:'game', badge:'green', label:'Stable', tagLabel:'Video Games',
    desc:'Larian Studios Divinity Engine. High-fidelity cinematic 3D &mdash; AAA cutscene quality. PBR materials, dramatic dialogue-scene lighting, volumetric god-rays. Rich saturated fantasy palette. D&amp;D sourcebook art brought to cinematic life.',
    descRu:'Divinity Engine, качество AAA кинематики. PBR материалы, кинематическое освещение. Богатая фэнтези-палитра. D&D sourcebook art, ожившее на экране.',
    longFile:'slay_baldursgate_long.txt', shortFile:'slay_baldursgate_short.txt', images:['baldursgate.jpg','baldursgate2.jpg','baldursgate3.jpg','baldursgate4.jpg','baldursgate5.jpg'] },
  { name:'S.T.A.L.K.E.R.', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'GSC Game World X-Ray Engine (2007). Mid-2000s 3D, slightly plastic skin, hard-edged shadows. Washed-out desaturated colour grading: grey-green, muddy brown, dirty yellow, overcast pale sky. That Eastern European game engine aesthetic.',
    descRu:'X-Ray Engine (2007). Средне-полигональные модели, жёсткие тени. Вымытая десатурированная палитра: серо-зелёный, грязно-коричневый. Эстетика восточноевропейского движка.',
    longFile:'slay_stalker_long.txt', shortFile:'slay_stalker_short.txt', images:['stalker.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u0440.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04402.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04403.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04404.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04405.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04406.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04407.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04408.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u04409.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u044010.jpg','\u0441\u0442\u0430\u043b\u043a\u0435\u044011.jpg'] },
  { name:'Minecraft', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'Blocky voxel world &mdash; everything from cubes. Characters: rectangular limbs, square heads, 64x64 pixelated skin textures. 16x16 pixel textures on each block face. No smooth curves anywhere. Simple directional light with hard blocky shadows.',
    descRu:'Воксельный мир из кубов. Прямоугольные конечности, квадратные головы, 64x64 пиксельные скины. Текстуры 16x16 на каждой грани блока. Никаких гладких кривых.',
    longFile:'slay_minecraft_long.txt', shortFile:'slay_minecraft_short.txt', images:['minecraft.jpg','minecraft2.jpg','minecraft3.jpg','minecraft4.jpg','minecraft5.jpg','\u043c\u0430\u0439\u043d\u043a\u0440\u0430\u0444\u0442.jpg'] },
  { name:'MMO 2000s', tag:'game', badge:'red', label:'Risky', tagLabel:'Video Games',
    desc:'Late 2000s stylised fantasy MMO. 3D game engine real-time rendering &mdash; NOT 2D painting. Aggressive unsharp-mask sharpening on every edge. Extremely oversaturated vivid colours: neon blues, lush greens, bright golds. Bloom on magical effects.',
    descRu:'ММО конца 2000х, 3D движок. Агрессивный шарпенинг. Вжаренная насыщенность: неоновые голубые, яркие зелёные, золотые. Блум на магии.',
    longFile:'slay_allods2_long.txt', shortFile:'slay_allods2_short.txt', images:['allods.jpg','allods2.jpg','allods3.jpg','allods4.jpg'] },
  { name:'Stardew Valley / Pixels', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'ConcernedApe pixel art. Visible square pixels, low resolution chunky aesthetic. Limited palette per sprite. No anti-aliasing. Warm cozy earth tones. Simple pixel faces. Indie pixel RPG quality.',
    descRu:'Пиксель-арт ConcernedApe. Видимые квадратные пиксели, низкое разрешение. Ограниченная палитра. Без сглаживания. Тёплые уютные земляные тона. Качество инди-пиксельной RPG.',
    longFile:'slay_stardew_long.txt', shortFile:'slay_stardew_short.txt', images:['\u0441\u0442\u0430\u0440\u0434\u044c\u044e.jpg','\u0441\u0442\u0430\u0440\u0434\u044c\u044e2.jpg'] },
  { name:'Genshin Impact', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'miHoYo anime cel-shaded 3D. Clean bold outlines on 3D models, flat cel-shaded 2-3 tone colouring. Very high saturation. Painterly atmospheric backgrounds. Dramatic anime lighting with rim lights and bloom.',
    descRu:'Аниме-сел-шейдинг 3D от miHoYo. Чёткие жирные контуры на 3D моделях, плоская окраска в 2-3 тона. Очень высокая насыщенность. Живописные атмосферные фоны. Рим-лайты и блум.',
    longFile:'slay_genshin_long.txt', shortFile:'slay_genshin_short.txt', images:['genshin.jpg','genshin2.jpg','genshin3.jpg'] },
  { name:'Borderlands', tag:'game', badge:'yellow', label:'Experimental', tagLabel:'Video Games',
    desc:'Gearbox cel-shaded 3D. Bold variable-weight ink outlines on ALL edges. Cross-hatching ink marks for shadow on 3D surfaces. Dusty earth-tone base with neon tech accents. The playable comic book aesthetic.',
    descRu:'Сел-шейдинг 3D от Gearbox. Жирные контуры тушью на всех гранях. Перекрёстная штриховка для теней на 3D. Пыльные земляные тона + неоновые акценты на технике. Играбельный комикс.',
    longFile:'slay_borderlands_long.txt', shortFile:'slay_borderlands_short.txt', images:['\u0431\u043e\u0440\u0434\u0435\u0440\u043b\u0435\u043d\u0434\u0441.jpg','\u0431\u043e\u0440\u0434\u0435\u0440\u043b\u0435\u043d\u0434\u04412.jpg'] },
  { name:'Point-and-Click Adventure', tag:'game', badge:'green', label:'Stable', tagLabel:'Video Games',
    desc:'2000s adventure game screenshot &mdash; Nancy Drew, Syberia, Broken Sword. Pre-rendered painterly backgrounds with mid-poly slightly stiff characters. Moody atmospheric lighting. Dark UI panel at bottom with inventory slots. 4:3 ratio.',
    descRu:'Скриншот квеста 2000х &mdash; Нэнси Дрю, Сибирь, Сломанный Меч. Пре-рендеренные живописные фоны с немного деревянными моделями. Атмосферное освещение. Панель UI внизу с инвентарём. Формат 4:3.',
    longFile:'slay_pointclick_long.txt', shortFile:'slay_pointclick_short.txt', images:['pointandclick.jpg','pointandclick2.jpg'] },

  // CARTOONS
  { name:'Adventure Time', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:"Pendleton Ward's Adventure Time aesthetic. Bold clean outlines, flat colour fills, simple geometric character shapes. Candy-bright palette with unexpected emotional depth. The contrast between simple visuals and complex feelings.",
    descRu:'Эстетика Adventure Time. Жирные контуры, плоские заливки, простая геометрия. Конфетно-яркая палитра с неожиданной эмоциональной глубиной.',
    longFile:'slay_adventuretime_long.txt', shortFile:'slay_adventuretime_short.txt', images:['adventuretime.jpg','adventuretime2.jpg'] },
  { name:'Star vs. the Forces of Evil', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:"Daron Nefcy's SVTFOE aesthetic. Expressive oversized eyes, dynamic magical effects with sparkle particles. Clean lines with slight hand-drawn wiggle. Bright saturated palette, magical girl energy. Three magic effect tiers.",
    descRu:'Эстетика SVTFOE. Выразительные огромные глаза, динамические магические эффекты. Яркая палитра, magical girl энергия.',
    longFile:'slay_starvsevil_long.txt', shortFile:'slay_starvsevil_short.txt', images:['starvstheforcesofevil.jpg','starvstheforcesofevil2.jpg','starvstheforcesofevil3.jpg'] },
  { name:'Rick and Morty', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:'Simple rounded shapes, thick bold uniform outlines, flat bright colours with zero gradients. Wobbly organic line quality. Detailed sci-fi backgrounds. Neon greens, vivid blues. Crude, energetic, irreverent.',
    descRu:'Простые округлые формы, жирные равномерные контуры, плоские яркие цвета без градиентов. Волнистая линия. Детальные сай-фай фоны. Неоновые зелёные, яркие синие. Грубо, энергично, дерзко.',
    longFile:'slay_rickandmorty_long.txt', shortFile:'slay_rickandmorty_short.txt', images:['\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u0438.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04382.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04383.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04384.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04385.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04386.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04387.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04388.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u04389.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u043810.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u043811.jpg','\u0440\u0438\u043a\u0438\u043c\u043e\u0440\u0442\u043812.jpg'] },
  { name:'Steven Universe', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:"Rebecca Sugar's aesthetic. Soft rounded shapes, pastel warm palette, consistent-weight outlines, flat fills with minimal shading. Painterly watercolour backgrounds more detailed than characters. Warm gentle golden-hour feeling.",
    descRu:'Эстетика Ребекки Шугар. Мягкие округлые формы, пастельная тёплая палитра, ровные контуры, плоские заливки. Акварельные фоны детальнее персонажей. Тёплое нежное ощущение золотого часа.',
    longFile:'slay_stevenuniverse_long.txt', shortFile:'slay_stevenuniverse_short.txt', images:['\u0441\u0442\u0438\u0432\u0435\u043d\u044e\u043d\u0438\u0432\u0435\u0440\u0441.jpg','\u0441\u0442\u0438\u0432\u0435\u043d\u044e\u043d\u0438\u0432\u0435\u0440\u04412.jpg','\u0441\u0442\u0438\u0432\u0435\u043d\u044e\u043d\u0438\u0432\u0435\u0440\u04413.jpg'] },
  { name:'Winx Club (Classic)', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:'Classic Winx (2004-2009). Extremely elongated proportions, large almond eyes with thick lashes, glossy voluminous hair. Bright candy saturated palette. Sparkle effects. Fashion-detailed outfits with shine.',
    descRu:'Классические Винкс (2004-2009). Вытянутые пропорции, большие миндалевидные глаза с густыми ресницами, блестящие объёмные волосы. Конфетная палитра. Блёстки. Модные детальные наряды.',
    longFile:'slay_winx_long.txt', shortFile:'slay_winx_short.txt', images:['\u0432\u0438\u043d\u043a\u0441.jpg','\u0432\u0438\u043d\u043a\u04412 (1).jpg','\u0432\u0438\u043d\u043a\u04412 (2).jpg'] },
  { name:'W.I.T.C.H.', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:'W.I.T.C.H. (2004-2006). Cleaner, more angular than Winx. Sharp facial features, deep saturated palette: purples, teals, magentas. Magical energy effects. European animated TV quality.',
    descRu:'Чародейки (2004-2006). Чище и угловатее Винкс. Острые черты лица, глубокая палитра: пурпур, тил, маджента. Магические эффекты энергии. Качество европейской ТВ-анимации.',
    longFile:'slay_witch_long.txt', shortFile:'slay_witch_short.txt', images:['witch.jpg','witch2.jpg','witch3.jpg'] },
  { name:'Bratz', tag:'cartoon', badge:'yellow', label:'Experimental', tagLabel:'Cartoons',
    desc:'Bratz doll aesthetic. Exaggerated doll proportions: huge head, enormous almond eyes, tiny nose, full glossy lips. Extreme gloss on everything. Fashion-magazine outfit detail. Y2K glamour: hot pinks, blacks, metallics.',
    descRu:'Эстетика кукол Братц. Утрированные кукольные пропорции: огромная голова, гигантские глаза, крошечный нос, пухлые блестящие губы. Блеск на всём. Детализированная мода. Y2K гламур.',
    longFile:'slay_bratz_long.txt', shortFile:'slay_bratz_short.txt', images:['bratz.jpg','bratz2.jpg','bratz3.jpg'] },
  { name:'Tim Burton', tag:'cartoon', badge:'green', label:'Stable', tagLabel:'Cartoons',
    desc:'Gothic whimsical. Extremely elongated thin proportions, giant dark-ringed eyes. High contrast: blacks vs pale whites. Spiral/curl motifs. German Expressionist distorted architecture. Striped patterns. Beautifully macabre.',
    descRu:'Готическая причудливость. Вытянутые тонкие пропорции, огромные глаза с тёмными кругами. Контраст: чёрное vs бледно-белое. Спиральные мотивы. Искажённая архитектура. Полоски. Красиво-мрачное.',
    longFile:'slay_timburton_long.txt', shortFile:'slay_timburton_short.txt', images:['timburton (1) art.jpg','timburtonart.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u0442.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04422.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04423.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04424.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04425.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04426.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04427.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04428.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u04429.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u044210.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u044211.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u044212.jpg','\u0442\u0438\u043c\u0431\u0451\u0440\u0442\u043e\u043d\u0430\u0440\u044213.jpg'] },

  // ANIME & MANGA
  { name:'Anime Still', tag:'anime', badge:'green', label:'Stable', tagLabel:'Anime & Manga',
    desc:'Prestige TV anime key frame &mdash; Your Name, Violet Evergarden quality. Clean cel-shading, luminous colour, cinematic 16:9. Yellow subtitle line at the bottom. The image looks like a paused frame from an episode.',
    descRu:'Кадр из престижного аниме — Your Name, Violet Evergarden. Сел-шейдинг, светящийся цвет, 16:9. Жёлтый субтитр внизу.',
    longFile:'slay_animestill_long.txt', shortFile:'slay_animestill_short.txt', images:['still anime short.jpg','still anime.jpg','still anime2.jpg','anime.jpg','anime2.jpg','anime3.jpg','anime4.jpg','anime5.jpg','anime6.jpg','anime7.jpg','anime8.jpg','anime9.jpg'] },
  { name:'Visual Novel', tag:'anime', badge:'green', label:'Stable', tagLabel:'Anime & Manga',
    desc:'VN dialogue screen format &mdash; two-zone image: scene zone (background + character) + dialogue zone (semi-transparent bar with name tag and short text). Anime-style character with VN-specific composition.',
    descRu:'Экран диалога визуальной новеллы — две зоны: сцена + диалоговая панель с именем и текстом.',
    longFile:'slay_visualnovel_long.txt', shortFile:'slay_visualnovel_short.txt', images:['novel.jpg','novel_short.jpg','novel2.jpg'] },
  { name:'Fourth Wall', tag:'anime', badge:'green', label:'Stable', tagLabel:'Anime & Manga',
    desc:'Background scene + foreground chibi character breaking the fourth wall. Chibi makes a comment about the scene in a small panel. Two layers: the narrative world and the meta-commentary character.',
    descRu:'Фоновая сцена + чиби-персонаж на переднем плане, ломающий четвёртую стену. Комментирует происходящее в маленькой панели.',
    longFile:'slay_fourthwall_long.txt', shortFile:'slay_fourthwall_short.txt', images:['4th wall.jpg','4th wall2.jpg'] },
  { name:'Manhwa', tag:'anime', badge:'green', label:'Stable', tagLabel:'Anime & Manga',
    desc:'Korean webtoon vertical scroll format. 3-4 panels per page. Clean digital lineart, soft cel-shading, luminous skin, large expressive eyes. Vibrant saturated colours with mood-shifted palette between panels. Speech bubbles, integrated SFX.',
    descRu:'Корейский вебтун, вертикальный скролл. 3-4 панели. Чистый лайнарт, мягкий сел-шейдинг, светящаяся кожа, большие глаза. Яркие цвета с переключением по настроению.',
    longFile:'slay_manhwa_long.txt', shortFile:'slay_manhwa_short.txt', images:['manhwa_nochibi.jpg','manhwa_nochibi2.jpg','manhwa_nochibi3.jpg','manhwa_nochibi4.jpg','manhwa_nochibi5.jpg','manhwa_nochibi6.jpg','manhwa_nochibi7.jpg','manhwa_nochibi8.jpg','manhwa_nochibi9.jpg','manhwa_nochibi10.jpg','manhwa_nochibi11.jpg'] },
  { name:'Chibi Manhwa', tag:'anime', badge:'green', label:'Stable', tagLabel:'Anime & Manga',
    desc:'Manhwa base with chibi inserts, speech bubbles, speed lines, screentones. Comedic manga-style deformation moments within the webtoon format. The "cute reaction" variant.',
    descRu:'Манхва-база с чиби-вставками, спич-баблами, спид-лайнами, скринтонами. Комедийные моменты деформации в формате вебтуна.',
    longFile:'chibi_slay_manhwa_long.txt', shortFile:'chibi_slay_manhwa_short.txt', images:['manhwa_chibi.jpg','\u0447\u0438\u0431\u0438_\u043c\u0430\u043d\u0445\u0432\u0430.jpg','manhwa_chibi2.jpg','manhwa_chibi3.jpg'] },
  { name:'Manga (B&amp;W)', tag:'anime', badge:'yellow', label:'Experimental', tagLabel:'Anime & Manga',
    desc:'Black and white Japanese manga page. Pure black ink on white paper &mdash; NO colour. Screentone dot patterns for shading, speed lines, focus lines, heavy blacks. 3-4 panels per single page. Full manga visual effects vocabulary. English only SFX.',
    descRu:'Чёрно-белая манга. Чёрная тушь на белой бумаге — БЕЗ цвета. Скринтоны для теней, спид-лайны, фокус-лайны. 3-4 панели на странице. SFX только на английском.',
    longFile:'slay_manga_long.txt', shortFile:'slay_manga_short.txt', images:['\u043c\u0430\u043d\u0433\u0430.jpg','\u043c\u0430\u043d\u0433\u04302.jpg','\u043c\u0430\u043d\u0433\u04303.jpg','\u043c\u0430\u043d\u0433\u04304.jpg','\u043c\u0430\u043d\u0433\u04305.jpg','\u043c\u0430\u043d\u0433\u04306.jpg','\u043c\u0430\u043d\u0433\u04307.jpg','\u043c\u0430\u043d\u0433\u04308.jpg','\u043c\u0430\u043d\u0433\u04309.jpg','\u043c\u0430\u043d\u0433\u043010.jpg','\u043c\u0430\u043d\u0433\u043011.jpg'] },
  { name:'Studio Ghibli', tag:'anime', badge:'green', label:'Stable', tagLabel:'Anime & Manga',
    desc:"Miyazaki's hand-drawn animation. Clean simple outlines, soft naturalistic proportions. Gorgeous watercolour landscape backgrounds. Natural warm luminous palette. Wind in hair, grass, curtains. Wonder, warmth, and reverence for the ordinary.",
    descRu:'Рисованная анимация Миядзаки. Чистые простые контуры, мягкие натуральные пропорции. Шикарные акварельные пейзажные фоны. Тёплая палитра. Ветер в волосах, траве, шторах. Чудо, тепло, благоговение перед обычным.',
    longFile:'slay_ghibli_long.txt', shortFile:'slay_ghibli_short.txt', images:['ghibli.jpg','ghibli2.jpg','ghibli4.jpg'] },

  // PRINT & GRAPHIC
  { name:'Hokusai (Ukiyo-e)', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Katsushika Hokusai woodblock print. Bold variable-weight ink outlines, flat colour fills with parallel hatching. Prussian blue dominant palette. Full vocabulary &mdash; not just waves. Figures, trees, birds, seasons, weather.',
    descRu:'Хокусай, укиё-э гравюра. Жирные контуры тушью, плоские заливки с параллельной штриховкой. Прусская синь доминирует. Полный словарь — не только волны.',
    longFile:'slay_hokusai_long.txt', shortFile:'slay_hokusai_short.txt', images:['hokusai short.jpg'] },
  { name:'Japanese Watercolor (Sumi-e)', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Sumi-e ink + watercolour wash. Negative space as composition. Minimal suggestion &mdash; what is NOT painted matters as much as what is. Ink line + colour wash on rice paper texture.',
    descRu:'Суми-э тушь + акварельная размывка. Негативное пространство как композиция. Минимальное обозначение — то, что НЕ нарисовано, важно так же.',
    longFile:'slay_japanwatercolor_long.txt', shortFile:'slay_japanwatercolor_short.txt', images:['japaneese aquarelle.jpg','AQUARELLE.jpg','japaneese aquarelle2_short.jpg','japaneese aquarelle3_short.jpg'] },
  { name:'Sketch', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Pencil/ink sketch on paper. Hatching for tone, no text annotations. Raw, immediate, alive &mdash; the energy of a first impression captured fast. Visible paper grain, graphite/ink quality.',
    descRu:'Карандаш/тушь на бумаге. Штриховка для тона. Сырое, непосредственное, живое — энергия первого впечатления, пойманного быстро.',
    longFile:'slay_sketch_long.txt', shortFile:'slay_sketch_short.txt', images:['sketch.jpg','SKETCH2.jpg','SKETCH3.jpg'] },
  { name:'Linocut', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Hand-carved block relief print. Bold black ink on white paper. All tone through parallel hatching &mdash; no gradients. Massive black areas with carved white negative space. Optional single accent colour. No text whatsoever.',
    descRu:'Ручная блочная печать. Чёрная краска на белой бумаге. Вся тональность через штриховку — ноль градиентов. Необязательный один акцентный цвет. Без текста.',
    longFile:'slay_linocut_long.txt', shortFile:'slay_linocut_short.txt', images:['\u043b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430 (2).jpg','\u043b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430.jpg','\u043b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430 (1).jpg','\u043b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430 4.jpg','\u043b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430 5.jpg'] },
  { name:'Pop Art', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Warhol / Lichtenstein. Bold uniform black outlines, flat colour fills, Ben-Day halftone dots. Limited 2-5 colour palette. Silkscreen or offset-print aesthetic. Maximum graphic impact. No text, no speech bubbles.',
    descRu:'Уорхол / Лихтенштейн. Жирные контуры, плоские заливки, точки Бен-Дэй. 2-5 цветов. Шелкография. Максимальный графический удар. Без текста и баблов.',
    longFile:'slay_popart_long.txt', shortFile:'slay_popart_short.txt', images:['pop art.jpg','pop art2.jpg','pop art3.jpg','popart.jpg','popart2.jpg','popart3.jpg','popart4.jpg','popart5.jpg','popart6.jpg','popart7.jpg'] },
  { name:'Soviet Mosaic', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Metro station mural aesthetic. Visible rectangular tile tesserae, grout-line outlines, stepped colour transitions. Communist red, warm gold, ochre, charcoal-black. Monumental heroic composition, radiating energy.',
    descRu:'Мозаика метро и Дворцов культуры. Видимые прямоугольные тессеры, швы-контуры. Красный, золото, охра, уголь. Монументальная героическая композиция.',
    longFile:'slay_sovietmosaic_long.txt', shortFile:'slay_sovietmosaic_short.txt', images:['MOSAIC SOVIET.jpg','MOSAIC SOVIET2.jpg','MOSAIC SOVIET3.jpg'] },
  { name:'Soviet Poster', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Gouache poster paint on paper, lithographic grain. Heroic realistic figures (not flat vector!). Constructivist or socialist realist substyles. Communist red, near-black, cream-white. Diagonal compositional energy. Paint texture and print quality visible.',
    descRu:'Гуашь на бумаге, литографическая зернистость. Героические реалистичные фигуры (не флэт-вектор!). Красный, чёрный, кремовый, жёлтый. Диагональная энергия.',
    longFile:'slay_sovietposter_long.txt', shortFile:'slay_sovietposter_short.txt', images:['\u0441\u043e\u0432\u0435\u0442\u0441\u043a\u0438\u0439 \u043f\u043b\u0430\u043a\u0430\u0442.jpg','\u0441\u043e\u0432\u0435\u0442\u0441\u043a\u0438\u0439 \u043f\u043b\u0430\u043a\u0430\u04422.jpg','\u0441\u043e\u0432\u0435\u0442\u0441\u043a\u0438\u0439 \u043f\u043b\u0430\u043a\u0430\u04423.jpg','\u0441\u043e\u0432\u0435\u0442\u0441\u043a\u0438\u0439 \u043f\u043b\u0430\u043a\u0430\u04424.jpg'] },
  { name:'Spider-Verse', tag:'print', badge:'yellow', label:'Experimental', tagLabel:'Print & Graphic',
    desc:'Spider-Verse animated film style. Cel-shaded 3D with comic book printing effects: Ben-Day halftone dots, CMYK misregistration, bold ink outlines, graffiti-textured backgrounds. Motion afterimages. Pop-art palette.',
    descRu:'Стиль Spider-Verse. Сел-шейдинг 3D с эффектами комикс-печати: точки Бен-Дэй, смещение CMYK, жирные контуры тушью, граффити-фоны. Следы движения. Поп-арт палитра.',
    longFile:'slay_spiderverse_long.txt', shortFile:'slay_spiderverse_short.txt', images:['spiderverse.jpg','spiderverse2.jpg','spiderverse3.jpg','spiderverse4.jpg','spiderverse5.jpg','spiderverse6.jpg'] },

  // 3D & ANIMATION
  { name:'Arcane v4', tag:'3d', badge:'red', label:'Risky', tagLabel:'3D & Animation',
    desc:'3D animated film still with theatrical coloured stage lighting. Coloured gels creating warm-cool zone splits. Mandatory bright rim lighting. Very high saturation and contrast. Atmospheric coloured particles. v4 drops the "Arcane" name to avoid safety filter issues.',
    descRu:'3D анимационный кадр с театральным цветным светом. Цветные гели создают тёплые-холодные зоны. Обязательный яркий рим-лайт. Очень высокая насыщенность и контраст.',
    longFile:'slay_arcane3_long.txt', shortFile:'slay_arcane3_short.txt', images:['arcane.jpg','arcane_1.jpg','arcane_3.jpg','arcane_4.jpg','arcane_5.jpg','arcane_6.jpg','arcane_7.jpg','arcane_8.jpg','arcane_9.jpg','arcane_10.jpg','arcane_11.jpg','arcane_12.jpg','arcane_13.jpg','arcane_14.jpg','arcane_15.jpg'] },
  { name:'Matt Rhodes v2 (BioWare)', tag:'3d', badge:'green', label:'Stable', tagLabel:'3D & Animation',
    desc:'Dragon Age animated cinematic style. Two distinct layers: bold ink outlines + cel-shading on characters, atmospheric painted backgrounds. Characters graphic and designed; environments alive and painted. Muted earthy palette with one saturated accent.',
    descRu:'Dragon Age анимационный стиль. Два слоя: жирные контуры + сел-шейдинг на персонажах, атмосферные фоны. Приглушённая палитра с одним насыщенным акцентом.',
    longFile:'slay_mattrhodes2_long.txt', shortFile:'slay_mattrhodes2_short.txt', images:['rhodes.jpg','\u043c\u044d\u0442 \u0440\u043e\u0434\u0441 (1).jpg','\u043c\u044d\u0442 \u0440\u043e\u0434\u0441 (2).jpg','\u043c\u044d\u0442 \u0440\u043e\u0434\u04413.jpg','\u043c\u044d\u0442 \u0440\u043e\u0434\u04414.jpg'] },
  { name:'Stop-Motion / Puppet', tag:'3d', badge:'green', label:'Stable', tagLabel:'3D & Animation',
    desc:'Stop-motion puppet animation &mdash; Isle of Dogs, Laika, Cheburashka. Characters as physical puppets: felt, fabric, clay, wood. Miniature handmade sets. Macro photography depth of field. Visible seams and tactile imperfection.',
    descRu:'Кукольная стоп-моушн анимация &mdash; Остров собак, Лайка, Чебурашка. Персонажи как физические куклы: фетр, ткань, глина, дерево. Миниатюрные декорации. Видимые швы и тактильное несовершенство.',
    longFile:'slay_stopmotion_long.txt', shortFile:'slay_stopmotion_short.txt', images:['stopmotion.jpg','stopmotion2.jpg'] },
  { name:'Tim Burton (Stop-Motion)', tag:'3d', badge:'green', label:'Stable', tagLabel:'3D & Animation',
    desc:'Tim Burton stop-motion puppet animation — Nightmare Before Christmas, Corpse Bride. Physical puppets: polymer clay skin, sewn miniature clothing, ball-joint articulation. Miniature Gothic sets. Macro photography depth of field.',
    descRu:'Тим Бёртон стоп-моушн — Кошмар перед Рождеством, Труп Невесты. Физические куклы: полимерная глина, сшитая мини-одежда, шарнирные суставы. Миниатюрные готические декорации.',
    longFile:'slay_burtonstop_long.txt', shortFile:'slay_burtonstop_short.txt', images:['timburton (2) stopmotion.jpg','timburton (2) stopmotion3.jpg','timburton (2) stopmotion4.jpg','timburton (2) stopmotion5.jpg'] },
];


// ═══ Tavo style hints — compact per-style generator prompts ═══
const tavoStyles = {
  'Monet': 'French Impressionist oil painting, no outlines, broken comma-dab brushstrokes of pure pigment, coloured shadows in violet and blue, vibrant pure palette, luminous natural light as the main subject',
  'Manet': 'realist proto-impressionist painting, flat taches of bold colour, dramatic blacks, direct confrontational gaze, visible brushwork, modern life rendered with unflinching directness',
  'Van Gogh': 'Post-Impressionist oil painting, thick impasto, swirling directional brushstrokes, intense saturated exaggerated colour, complementary contrasts, emotional vibrating surface, every stroke visible',
  'Serov': 'Russian impressionist portrait, fresh window light, luminous natural skin, restrained warm palette with subtle warmth, psychological presence, visible painterly brushwork',
  'Rembrandt': 'Dutch Golden Age chiaroscuro oil painting, single warm lamp light, deep warm shadows, golden figures emerging from near-darkness, thick impasto highlights, thin shadow glazes',
  'Repin': 'Russian realist oil painting, psychological depth, rich earthy palette, dramatic natural lighting, weighty human presence, detailed expressive figures and faces',
  'Klimt': 'Vienna Secession gold leaf painting, luminous semi-realistic faces and hands against flat ornamental pattern fields, gold mosaic tiles, spirals and geometric motifs, decorative pattern dissolving the body',
  'Dark Fantasy': 'digital oil painting prestige novel cover quality, rich painterly texture, visible brushwork, deep dramatic shadows, atmospheric fantasy lighting, moody saturated palette',
  'Classic Fantasy': '1980s-90s TSR D&D book cover art, oil on canvas, warm lush saturated palette, heroic flattering light, romantic fantasy illustration with gold, forest green, royal blue, firelight orange',
  'Horror Illustration': 'Bernie Wrightson Brom tradition oil painting, extreme chiaroscuro with 70% of the image in shadow, impasto highlights, single harsh dramatic light source carving form from darkness, deep warm-brown shadows',
  'Art Nouveau (Mucha)': 'Alphonse Mucha inspired illustration, central figure framed by ornamental botanical border of flowers and vines, decorative halo arch, thin confident lineart, pastel palette with gold leaf accents',
  'Bilibin v3': 'Ivan Bilibin Russian fairy tale illustration, ink outlines with atmospheric watercolour washes, muted naturalistic palette, ornament on costumes and architecture, painterly depth',
  'Pin-up': 'Gil Elvgren Alberto Vargas pin-up tradition, smooth luminous oil and gouache seamlessly blended, warm glowing skin, vivid flat background, playful caught-moment pose, the figure as the entire subject',
  'Cinematic Realism': 'literal prestige film frame, photorealistic, organic film grain, selective depth of field, practical light sources, three director substyles — Kubrick cold symmetric, Tarantino warm saturated, Nolan blue-amber IMAX',
  'Cinematic Art': 'movie concept art semi-realism, painted film poster quality, Drew Struzan tradition, illustrated cinematic lighting, three technique registers — tight digital paint, expressive oil, graphic painted poster',
  'Film Noir': 'classic 1940s-50s noir, near-monochrome black and white, extreme chiaroscuro, venetian blind shadows, wet streets, smoke in light beams, hard shadow lines across faces, organic film grain',
  'Sin City': 'Frank Miller extreme black and white, mostly pure black with white carved from darkness, ONE selective colour element per image (red blood, golden hair, blue eyes), ink-splash graphic novel aesthetic',
  'Webcam / Candid Photo': 'candid mid-2000s cheap digital camera or webcam snapshot, visible JPEG artifacts, digital noise, bad white balance, imperfect off-center composition, natural body language caught mid-moment, amateur photo quality',
  'Oldschool Lowpoly Game': 'early 2000s Bethesda RPG engine, low-polygon 3D models, blurry stretched textures, angular geometric faces, simple flat lighting, muted earthy palette of ash grey, mud brown and dark green, atmospheric distance fog',
  'Skyrim': 'Bethesda Creation Engine mid-fidelity 3D, desaturated cold steel-blue exteriors, warm amber-gold firelight interiors, real-time shadows, Nordic fur, pitted iron, worn leather, stone texture',
  "Baldur's Gate 3": 'Larian Divinity Engine cinematic 3D, AAA cutscene quality, PBR materials, dramatic dialogue-scene lighting, volumetric god-rays, rich saturated fantasy palette, D&D sourcebook art brought to life',
  'S.T.A.L.K.E.R.': 'mid-2000s GSC X-Ray Engine 3D, slightly plastic skin, hard-edged shadows, washed-out desaturated colour grading — grey-green, muddy brown, dirty yellow, overcast pale sky, Eastern European post-apocalyptic atmosphere',
  'Minecraft': 'blocky voxel world, everything from cubes, rectangular limbs and square heads, 64x64 pixelated skin textures, 16x16 pixel textures on each block face, no smooth curves, hard blocky shadows',
  'MMO 2000s': 'late 2000s stylised fantasy MMO 3D engine, aggressive unsharp-mask sharpening on every edge, extremely oversaturated neon blues, lush greens, bright golds, bloom on magical effects',
  'Stardew Valley / Pixels': 'ConcernedApe pixel art, visible square pixels, low-resolution chunky aesthetic, limited palette per sprite, no anti-aliasing, warm cozy earth tones, indie pixel RPG quality',
  'Genshin Impact': 'miHoYo anime cel-shaded 3D, clean bold outlines on 3D models, flat 2-3 tone cel colouring, very high saturation, painterly atmospheric backgrounds, dramatic anime rim lights and bloom',
  'Borderlands': 'Gearbox cel-shaded 3D, bold variable-weight ink outlines on ALL edges, cross-hatching ink marks for shadow on 3D surfaces, dusty earth-tones with neon tech accents, playable comic book aesthetic',
  'Point-and-Click Adventure': '2000s adventure game screenshot — Nancy Drew, Syberia, Broken Sword — pre-rendered painterly backgrounds with mid-poly slightly stiff characters, moody atmospheric lighting, 4:3 ratio, dark UI panel at bottom',
  'Adventure Time': "Pendleton Ward Adventure Time aesthetic, bold clean outlines, flat colour fills, simple geometric character shapes, candy-bright palette with unexpected emotional depth",
  'Star vs. the Forces of Evil': 'Daron Nefcy SVTFOE aesthetic, expressive oversized eyes, dynamic magical sparkle effects, clean lines with slight hand-drawn wiggle, bright saturated magical-girl palette',
  'Rick and Morty': 'simple rounded shapes, thick bold uniform outlines, flat bright colours with zero gradients, wobbly organic line quality, detailed sci-fi backgrounds, neon greens and vivid blues, crude energetic irreverent',
  'Steven Universe': 'Rebecca Sugar aesthetic, soft rounded shapes, pastel warm palette, consistent-weight outlines, flat fills with minimal shading, painterly watercolour backgrounds, golden-hour warmth',
  'Winx Club (Classic)': 'classic 2004-2009 Winx Club style, extremely elongated proportions, large almond eyes with thick lashes, glossy voluminous hair, bright candy saturated palette, sparkle effects, fashion-detailed outfits',
  'W.I.T.C.H.': '2004-2006 W.I.T.C.H. animation, sharp angular facial features, deep saturated palette of purples, teals and magentas, magical energy effects, European TV animation quality',
  'Bratz': 'Bratz doll aesthetic, exaggerated doll proportions, huge head, enormous almond eyes, tiny nose, full glossy lips, extreme gloss, Y2K glamour palette of hot pinks, blacks and metallics',
  'Tim Burton': 'Tim Burton gothic whimsical style, extremely elongated thin proportions, giant dark-ringed eyes, high contrast blacks versus pale whites, spiral and curl motifs, striped patterns, German Expressionist distorted architecture',
  'Anime Still': 'prestige TV anime key frame, Your Name Violet Evergarden quality, clean cel-shading, luminous colour, cinematic 16:9 aspect ratio, yellow subtitle line at the bottom, paused episode frame feel',
  'Visual Novel': 'visual novel dialogue screen, two-zone composition — scene zone with background and anime-style character, plus semi-transparent dialogue bar with name tag and short text',
  'Fourth Wall': 'anime background scene with chibi foreground character breaking the fourth wall in a small panel, two layers of narrative world plus meta-commentary character',
  'Manhwa': 'Korean webtoon vertical scroll format, clean digital lineart, soft cel-shading, luminous skin, large expressive eyes, vibrant saturated colours with mood-shifted palettes between panels',
  'Chibi Manhwa': 'manhwa base with chibi reaction inserts, speech bubbles, speed lines, screentones, comedic manga-style deformation moments within the webtoon format',
  'Manga (B&amp;W)': 'black and white Japanese manga page, pure black ink on white paper, no colour, screentone dot shading, speed lines, focus lines, heavy blacks, 3-4 panels per page, English-only SFX',
  'Studio Ghibli': 'Miyazaki hand-drawn animation, clean simple outlines, soft natural proportions, gorgeous watercolour landscape backgrounds, warm luminous natural palette, wind in hair grass and curtains, nostalgic reverent warmth',
  'Hokusai (Ukiyo-e)': 'Katsushika Hokusai woodblock print, bold variable-weight ink outlines, flat colour fills with parallel hatching, Prussian blue dominant palette, ukiyo-e aesthetic, full vocabulary of figures trees birds weather',
  'Japanese Watercolor (Sumi-e)': 'sumi-e ink and watercolour wash on rice paper, negative space as composition, minimal suggestion, ink line plus colour wash, what is NOT painted matters as much as what is',
  'Sketch': 'pencil or ink sketch on paper, hatching for tone, raw immediate alive quality, visible paper grain, graphite and ink mark-making, first impression captured fast',
  'Linocut': 'hand-carved block relief print, bold black ink on white paper, all tone through parallel hatching with no gradients, massive black areas with carved white negative space, optional single accent colour',
  'Pop Art': 'Warhol Lichtenstein pop art, bold uniform black outlines, flat colour fills, Ben-Day halftone dots, limited 2-5 colour palette, silkscreen or offset-print aesthetic, maximum graphic impact',
  'Soviet Mosaic': 'Soviet metro station mural mosaic, visible rectangular tile tesserae, grout-line outlines, stepped colour transitions, communist red with warm gold, ochre and charcoal-black, monumental heroic radiating composition',
  'Soviet Poster': 'Soviet gouache poster paint on paper, lithographic grain, heroic realistic figures, constructivist or socialist realist substyle, communist red, near-black, cream-white palette, diagonal compositional energy',
  'Spider-Verse': 'Spider-Verse animated film style, cel-shaded 3D with comic book printing effects, Ben-Day halftone dots, CMYK misregistration, bold ink outlines, graffiti-textured backgrounds, motion afterimages, pop-art palette',
  'Arcane v4': 'Arcane 3D animated film still, theatrical coloured stage lighting with warm-cool zone splits from coloured gels, mandatory bright rim lighting, very high saturation and contrast, atmospheric coloured particles',
  'Matt Rhodes v2 (BioWare)': 'Dragon Age animated cinematic style, bold ink outlines plus cel-shading on characters, atmospheric painted backgrounds, characters graphic and designed, muted earthy palette with one saturated accent',
  'Stop-Motion / Puppet': 'stop-motion puppet animation — Isle of Dogs, Laika, Cheburashka — felt, fabric, clay, wood puppets, miniature handmade sets, macro photography depth of field, visible seams and tactile imperfection',
  'Tim Burton (Stop-Motion)': 'Tim Burton stop-motion puppet animation — Nightmare Before Christmas, Corpse Bride — polymer clay skin, sewn miniature clothing, ball-joint articulation, miniature Gothic sets, macro photography'
};

// Badge label translations
const badgeLabelRu = { 'Stable': 'Стабильный', 'Experimental': 'Экспериментальный', 'Risky': 'Рискованный' };

// Tag label translations (new system)
const tagLabelRu = {
  'Painting': 'Живопись',
  'Illustration': 'Иллюстрация',
  'Film & Photo': 'Кино и фото',
  'Video Games': 'Видеоигры',
  'Cartoons': 'Мульты',
  'Anime & Manga': 'Аниме и манга',
  'Print & Graphic': 'Графика',
  '3D & Animation': '3D и анимация'
};

// Build the carousel HTML
function carouselHtml(images) {
  if (!images || images.length === 0) {
    return `<div class="carousel-wrap" data-carousel><div class="carousel-track"><div class="carousel-placeholder" data-ru="скриншоты скоро" data-en="screenshots coming soon">скриншоты скоро</div></div><button class="carousel-btn prev">&larr;</button><button class="carousel-btn next">&rarr;</button></div><div class="carousel-dots"></div>`;
  }
  const imgs = images.map(i => `<img src="images/${encodeURIComponent(i)}" alt="" loading="lazy">`).join('');
  return `<div class="carousel-wrap" data-carousel><div class="carousel-track">${imgs}</div><button class="carousel-btn prev">&larr;</button><button class="carousel-btn next">&rarr;</button></div><div class="carousel-dots"></div>`;
}

// Build one card
function cardHtml(s) {
  const longContent = readFile(s.longFile);
  const shortContent = readFile(s.shortFile);
  const directContent = esc(extractDirect(s.longFile));
  const longTokens = Math.round(longContent.length / 3.5);
  const shortTokens = Math.round(shortContent.length / 3.5);
  const tavoRaw = tavoStyles[s.name];
  const tavoContent = tavoRaw ? esc('[Image generation hint, STYLE:\n' + tavoRaw + ']') : 'wip';
  const longEsc = esc(longContent);
  const shortEsc = esc(shortContent);
  const badgeRu = badgeLabelRu[s.label] || s.label;
  const tagRu = tagLabelRu[s.tagLabel] || s.tagLabel;
  return `
<article class="style-card" data-tags="${s.tag}">
  <header class="card-head">
    <div class="card-head-left">
      <h2 class="card-title">${s.name}</h2>
      <p class="card-desc" data-ru="${esc(s.descRu || s.desc)}" data-en="${esc(s.desc)}">${esc(s.descRu || s.desc)}</p>
    </div>
    <div class="card-badges">
      <span class="badge badge-${s.badge}" data-ru="${badgeRu}" data-en="${s.label}">${badgeRu}</span>
      <span class="badge badge-tag" data-ru="${tagRu}" data-en="${s.tagLabel}">${tagRu}</span>
    </div>
  </header>
  ${carouselHtml(s.images)}
  <div class="prompt-block">
    <div class="prompt-tabs" role="tablist">
      <button class="prompt-tab active" data-tab="long"><span class="tab-label" data-ru="\u0414\u043B\u0438\u043D\u043D\u044B\u0439" data-en="Long">\u0414\u043B\u0438\u043D\u043D\u044B\u0439</span><span class="tab-tokens">~${longTokens}</span></button>
      <button class="prompt-tab" data-tab="short"><span class="tab-label" data-ru="\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439" data-en="Short">\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439</span><span class="tab-tokens">~${shortTokens}</span></button>
      <button class="prompt-tab" data-tab="direct"><span class="tab-label" data-ru="\u0413\u0435\u043C\u0438\u043D\u0438" data-en="Gemini">\u0413\u0435\u043C\u0438\u043D\u0438</span></button>
      <button class="prompt-tab" data-tab="tavo"><span class="tab-label">Tavo</span></button>
    </div>
    <div class="prompt-panel active" data-panel="long">
      <button class="copy-btn" data-copy data-ru="\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C" data-en="Copy">\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>
      <code class="prompt-code">${longEsc}</code>
    </div>
    <div class="prompt-panel" data-panel="short">
      <button class="copy-btn" data-copy data-ru="\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C" data-en="Copy">\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>
      <code class="prompt-code">${shortEsc}</code>
    </div>
    <div class="prompt-panel" data-panel="direct">
      <button class="copy-btn" data-copy data-ru="\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C" data-en="Copy">\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>
      <code class="prompt-code">${directContent}</code>
    </div>
    <div class="prompt-panel" data-panel="tavo">
      <button class="copy-btn" data-copy data-ru="\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C" data-en="Copy">\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>
      <code class="prompt-code">${tavoContent}</code>
    </div>
  </div>
</article>`;
}

// Section comments
const sections = {
  painting: '<!-- PAINTING STYLES -->',
  illustration: '<!-- ILLUSTRATION STYLES -->',
  film: '<!-- FILM & PHOTO STYLES -->',
  game: '<!-- VIDEO GAMES STYLES -->',
  cartoon: '<!-- CARTOON STYLES -->',
  anime: '<!-- ANIME & MANGA STYLES -->',
  print: '<!-- PRINT & GRAPHIC STYLES -->',
  '3d': '<!-- 3D & ANIMATION STYLES -->'
};

let cards = '';
let currentTag = '';
for (const s of styles) {
  if (s.tag !== currentTag) {
    currentTag = s.tag;
    cards += `\n<!-- ${'='.repeat(50)} -->\n${sections[currentTag] || ''}\n<!-- ${'='.repeat(50)} -->\n`;
  }
  cards += cardHtml(s);
}

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SLAY Images — Style Presets Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0a0a0f;--bg-2:#12121a;--bg-card:rgba(22,22,30,0.55);
    --fg:#f5f2e8;--fg-dim:rgba(245,242,232,0.62);--fg-dimmer:rgba(245,242,232,0.34);
    --pink:#ec4899;--pink-2:#f472b6;--pink-soft:rgba(236,72,153,0.14);--pink-line:rgba(236,72,153,0.34);
    --cream:#faf6eb;--gold:#d4af7a;
    --border:rgba(255,255,255,0.07);--border-strong:rgba(255,255,255,0.13);
    --green:#7dd3a0;--yellow:#fbbf24;--red:#f87171;
    --font-display:'Fraunces',Georgia,serif;
    --font-body:'Instrument Sans',system-ui,-apple-system,sans-serif;
    --font-mono:'JetBrains Mono','Cascadia Code','Consolas',monospace;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth;overflow-x:hidden}
  body{font-family:var(--font-body);background:var(--bg);color:var(--fg);line-height:1.55;font-feature-settings:"ss01","cv11";-webkit-font-smoothing:antialiased;overflow-x:hidden}
  body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(236,72,153,0.08),transparent 70%),radial-gradient(ellipse 60% 40% at 85% 20%,rgba(212,175,122,0.05),transparent 70%);pointer-events:none;z-index:0}
  body>*{position:relative;z-index:1}
  a{color:var(--pink);text-decoration:none;border-bottom:1px solid rgba(236,72,153,0.3);transition:all .2s}
  a:hover{color:var(--pink-2);border-bottom-color:var(--pink-2)}
  h1,h2,h3{font-family:var(--font-display);font-weight:800;letter-spacing:-0.02em;line-height:1.05}

  /* ── HERO ── */
  .hero{padding:40px 24px 40px;max-width:1100px;margin:0 auto;text-align:left}
  .hero-banner{margin:0 0 32px;border-radius:4px;overflow:hidden;border:1px solid var(--border);background:#0c0c12}
  .hero-banner img{width:100%;height:auto;display:block;cursor:zoom-in}
  .hero-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:60px}
  .brand-mark{font-family:var(--font-display);font-size:1.1rem;font-weight:800;letter-spacing:0.22em;color:var(--gold);text-transform:uppercase}
  .brand-mark::before{content:'★ ';color:var(--pink)}
  .lang-toggle{display:flex;border:1px solid var(--border-strong);border-radius:2px;overflow:hidden;background:rgba(0,0,0,0.4)}
  .lang-btn{padding:6px 14px;border:none;background:transparent;color:var(--fg-dimmer);font-family:var(--font-body);font-size:0.72rem;font-weight:700;letter-spacing:0.18em;cursor:pointer;transition:all .2s}
  .lang-btn.active{background:var(--pink);color:#0a0a0f}
  .lang-btn:hover:not(.active){color:var(--fg)}
  .hero-title{font-size:clamp(3.2rem,10vw,8rem);font-weight:800;line-height:0.92;letter-spacing:-0.04em;font-variation-settings:"opsz" 144,"SOFT" 30}
  .hero-title i{font-style:italic;color:var(--pink);font-weight:400}
  .hero-title .and{font-size:0.45em;vertical-align:middle;color:var(--gold);font-style:italic;font-weight:400;padding:0 0.15em}
  .hero-tagline{font-family:var(--font-display);font-style:italic;font-size:clamp(1.05rem,2vw,1.4rem);color:var(--fg-dim);max-width:680px;margin-top:24px;line-height:1.5}
  .hero-meta{display:flex;gap:34px;margin-top:44px;flex-wrap:wrap;padding-top:28px;border-top:1px solid var(--border)}
  .hero-meta-item{display:flex;flex-direction:column;gap:2px}
  .hero-meta-num{font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--pink);line-height:1}
  .hero-meta-label{font-size:0.7rem;color:var(--fg-dimmer);text-transform:uppercase;letter-spacing:0.12em}

  /* ── INTRO / INSTALL SECTIONS ── */
  .intro-wrap{max-width:1100px;margin:0 auto;padding:20px 24px 40px}
  .intro-card{background:var(--bg-card);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--border);border-radius:4px;padding:36px 40px;margin-bottom:28px;position:relative}
  .intro-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:40px;background:var(--pink)}
  .intro-kicker{font-family:var(--font-body);font-size:0.68rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
  .intro-card h2{font-size:clamp(1.6rem,3vw,2.3rem);margin-bottom:20px;color:var(--cream)}
  .intro-card p{color:var(--fg-dim);font-size:0.96rem;margin-bottom:14px;line-height:1.7}
  .intro-card p:last-child{margin-bottom:0}
  .intro-card .love{font-family:var(--font-display);font-style:italic;color:var(--pink-2);font-size:0.92rem;display:block;margin-top:4px;padding-left:14px;border-left:2px solid var(--pink-line)}
  .intro-warn{background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);border-left:3px solid var(--yellow);padding:18px 22px;border-radius:4px;margin-top:24px}
  .intro-warn strong{color:var(--yellow);font-weight:700;letter-spacing:0.05em}
  .intro-warn p{color:var(--fg-dim);font-size:0.88rem;margin-top:8px;margin-bottom:8px}
  .intro-warn ol{color:var(--fg-dim);font-size:0.88rem;padding-left:20px;margin-top:8px}
  .intro-warn li{margin-bottom:6px}
  .intro-faq{background:rgba(236,72,153,0.05);border:1px solid rgba(236,72,153,0.18);border-left:3px solid var(--pink);padding:18px 22px;border-radius:4px;margin-top:24px}
  .intro-faq strong{display:block;color:var(--pink);font-family:var(--font-display);font-size:1.05rem;font-weight:700;letter-spacing:0;margin-bottom:8px;font-style:italic}
  .intro-faq p{color:var(--fg-dim);font-size:0.88rem;margin:0;line-height:1.65}

  .install-card{background:var(--bg-card);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--border);border-radius:4px;padding:36px 40px;position:relative}
  .install-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:40px;background:var(--gold)}
  .install-card h2{font-size:clamp(1.6rem,3vw,2.3rem);margin-bottom:24px;color:var(--cream)}
  .install-steps{display:flex;flex-direction:column;gap:20px;margin-top:18px}
  .install-step{display:flex;gap:20px;align-items:flex-start;padding:16px 0;border-top:1px dashed var(--border)}
  .install-step:first-child{border-top:none;padding-top:0}
  .step-num{font-family:var(--font-display);font-size:2.6rem;font-weight:800;color:var(--pink);line-height:0.9;flex-shrink:0;min-width:60px;font-style:italic}
  .step-body{flex:1;padding-top:8px}
  .step-body h3{font-size:1.1rem;font-family:var(--font-body);font-weight:700;color:var(--cream);margin-bottom:6px;letter-spacing:0}
  .step-body p{color:var(--fg-dim);font-size:0.9rem;line-height:1.6}

  .install-card summary{list-style:none;cursor:pointer;display:block;outline:none;user-select:none;margin:0}
  .install-card summary::-webkit-details-marker{display:none}
  .install-card summary::marker{content:''}
  .install-summary{position:relative;padding-right:50px}
  .install-summary .intro-kicker{margin-bottom:10px}
  .install-summary h2{margin-bottom:0;transition:margin-bottom .25s}
  .install-card[open] .install-summary h2{margin-bottom:0}
  .install-arrow{position:absolute;top:50%;right:0;transform:translateY(-40%);font-size:2rem;color:var(--gold);transition:transform .25s;line-height:1;display:inline-block}
  .install-card[open] .install-arrow{transform:translateY(-60%) rotate(180deg)}
  .install-content{animation:slideDown .3s ease}
  @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}

  .install-image{margin-top:28px;padding:20px;border:1px dashed var(--border-strong);border-radius:4px;text-align:center;background:rgba(0,0,0,0.25)}
  .install-image img{max-width:100%;border-radius:2px;display:block;margin:0 auto;cursor:zoom-in;transition:opacity .15s}
  .install-image img:hover{opacity:0.9}
  .install-image .placeholder{color:var(--fg-dimmer);font-family:var(--font-display);font-style:italic;font-size:0.9rem;padding:40px 20px}

  /* ── FILTER BAR ── */
  .filter-bar{position:sticky;top:0;z-index:100;background:rgba(10,10,15,0.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:12px 0;width:100%}
  .filter-bar-inner{max-width:1100px;margin:0 auto;padding:0 24px;display:flex;gap:12px;align-items:center}
  .filter-group{display:flex;gap:5px;flex:1;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
  .filter-group::-webkit-scrollbar{display:none}
  .search-wrap{position:relative;flex-shrink:0}
  .search-wrap input{background:rgba(255,255,255,0.05);border:1px solid var(--border-strong);border-radius:2px;padding:7px 12px 7px 30px;color:var(--fg);font-family:var(--font-body);font-size:0.78rem;width:200px;outline:none;transition:border-color .18s}
  .search-wrap input::placeholder{color:var(--fg-dimmer)}
  .search-wrap input:focus{border-color:var(--pink)}
  .search-wrap::before{content:'\u2315';position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--fg-dimmer);font-size:0.95rem;pointer-events:none}
  .filter-btn{padding:7px 14px;border-radius:2px;border:1px solid var(--border);background:transparent;color:var(--fg-dim);font-family:var(--font-body);font-size:0.74rem;font-weight:600;letter-spacing:0.05em;cursor:pointer;transition:all .2s;text-transform:lowercase;white-space:nowrap;flex-shrink:0}
  .filter-btn:hover{color:var(--fg);border-color:var(--border-strong)}
  .filter-btn.active{background:var(--pink);border-color:var(--pink);color:#0a0a0f}

  /* ── STYLE CARDS ── */
  .styles-container{max-width:1100px;margin:0 auto;padding:36px 24px 40px;width:100%}
  .styles-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;width:100%}
  .styles-grid .style-card{display:none}
  .styles-grid .style-card.visible{display:flex;flex-direction:column;width:100%;min-width:0;max-width:100%}
  .style-card{background:var(--bg-card);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:4px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.3);position:relative;transition:border-color .18s,transform .18s}
  .style-card:hover{border-color:rgba(255,255,255,0.14)}
  .style-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:50px;background:var(--pink);z-index:2}
  .card-head{padding:16px 18px 10px;display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
  .card-head-left{flex:1;min-width:0}
  .card-title{font-size:1.15rem;color:var(--cream);margin-bottom:6px;line-height:1.15}
  .card-desc{font-size:0.76rem;color:var(--fg-dim);line-height:1.55;max-width:none}
  .card-badges{display:flex;flex-direction:column;gap:4px;align-items:flex-end;flex-shrink:0}

  /* ── BADGES ── */
  .badge{padding:3px 8px;border-radius:2px;font-family:var(--font-body);font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap}
  .badge-green{background:rgba(125,211,160,0.1);color:var(--green);border:1px solid rgba(125,211,160,0.3)}
  .badge-yellow{background:rgba(251,191,36,0.1);color:var(--yellow);border:1px solid rgba(251,191,36,0.3)}
  .badge-red{background:rgba(248,113,113,0.1);color:var(--red);border:1px solid rgba(248,113,113,0.3)}
  .badge-tag{background:rgba(212,175,122,0.08);color:var(--gold);border:1px solid rgba(212,175,122,0.22)}

  /* ── CAROUSEL ── */
  .carousel-wrap{position:relative;overflow:hidden;margin:0 18px;border-radius:2px;border:1px solid var(--border);background:#0c0c12;cursor:zoom-in;max-width:calc(100% - 36px)}
  .carousel-track{display:flex;transition:transform .5s cubic-bezier(.4,0,.2,1)}
  .carousel-track img{min-width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#0c0c12}
  .carousel-btn{position:absolute;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;border:1px solid var(--border-strong);background:rgba(0,0,0,0.7);color:var(--cream);font-size:0.85rem;cursor:pointer;z-index:5;display:flex;align-items:center;justify-content:center;transition:all .2s;backdrop-filter:blur(6px)}
  .carousel-btn:hover{background:var(--pink);color:#0a0a0f;border-color:var(--pink)}
  .carousel-btn.prev{left:8px}.carousel-btn.next{right:8px}
  .carousel-btn:disabled{opacity:0.28;cursor:default}
  .carousel-counter{position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,0.72);color:rgba(255,255,255,0.65);font-size:0.6rem;font-family:var(--font-mono);padding:2px 7px;border-radius:10px;z-index:4;backdrop-filter:blur(4px);pointer-events:none}
  .carousel-dots{display:flex;justify-content:center;gap:5px;padding:8px 0 2px;flex-wrap:wrap;max-width:100%}
  .carousel-dot{width:16px;height:2px;background:rgba(255,255,255,0.18);border:none;cursor:pointer;transition:all .2s;padding:0;border-radius:1px}
  .carousel-dot.active{background:var(--pink);width:24px}
  .carousel-placeholder{min-width:100%;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;color:var(--fg-dimmer);font-family:var(--font-display);font-style:italic;font-size:0.92rem}

  /* ── PROMPT TABS ── */
  .prompt-block{padding:14px 18px 16px;margin-top:auto}
  .prompt-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:0}
  .prompt-tab{flex:1;padding:9px 4px;border:none;background:transparent;color:var(--fg-dimmer);font-family:var(--font-body);font-size:0.66rem;font-weight:700;letter-spacing:0.04em;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:4px;border-bottom:2px solid transparent;margin-bottom:-1px;text-transform:uppercase}
  .prompt-tab:hover{color:var(--fg)}
  .prompt-tab.active{color:var(--pink);border-bottom-color:var(--pink)}
  .tab-label{text-transform:uppercase;letter-spacing:0.1em}
  .tab-tokens{font-family:var(--font-mono);font-size:0.58rem;color:var(--fg-dimmer);font-weight:400}
  .prompt-tab.active .tab-tokens{color:rgba(236,72,153,0.6)}
  .prompt-panel{display:none;position:relative;margin-top:16px;background:rgba(0,0,0,0.32);border:1px solid var(--border);border-radius:2px;overflow:hidden}
  .prompt-panel.active{display:block}
  .prompt-code{display:block;padding:10px 46px 10px 12px;height:90px;overflow-y:auto;font-family:var(--font-mono);font-size:0.66rem;line-height:1.6;color:rgba(220,220,230,0.8);white-space:pre-wrap;word-break:break-word}
  .prompt-code::-webkit-scrollbar{width:5px}
  .prompt-code::-webkit-scrollbar-track{background:transparent}
  .prompt-code::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:0}
  .copy-btn{position:absolute;top:8px;right:8px;padding:4px 9px;border-radius:2px;border:1px solid var(--border-strong);background:rgba(10,10,15,0.7);color:var(--fg-dim);font-family:var(--font-body);font-size:0.58rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all .2s;z-index:2}
  .copy-btn:hover{background:var(--pink);color:#0a0a0f;border-color:var(--pink)}
  .copy-btn.copied{background:var(--green);color:#0a0a0f;border-color:var(--green)}


  /* ── PAGINATION ── */
  .pagination-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:40px}
  .pagination{display:flex;align-items:center;gap:5px;flex-wrap:wrap;justify-content:center}
  .pg-btn{padding:7px 14px;border-radius:2px;border:1px solid var(--border);background:transparent;color:var(--fg-dim);font-family:var(--font-body);font-size:0.76rem;cursor:pointer;transition:all .15s}
  .pg-btn:hover:not(:disabled):not(.active){border-color:var(--border-strong);color:var(--fg)}
  .pg-btn.active{background:var(--pink);border-color:var(--pink);color:#0a0a0f;font-weight:700}
  .pg-btn:disabled{opacity:0.28;cursor:default}
  .pg-dots{color:var(--fg-dimmer);padding:0 4px;font-size:0.82rem}
  .pg-info{font-size:0.75rem;color:var(--fg-dimmer);font-family:var(--font-display);font-style:italic}
  .no-results{grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--fg-dimmer);font-family:var(--font-display);font-style:italic;font-size:1.05rem}

  /* ── RANDOM SECTION ── */
  .random-section{max-width:1100px;margin:20px auto 0;padding:40px 24px 80px;border-top:1px solid var(--border)}
  .random-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:12px}
  .random-label{display:flex;align-items:center;gap:10px}
  .random-label::before{content:'\u2726';color:var(--gold);font-size:1.1rem}
  .random-label span{font-family:var(--font-display);font-size:1.3rem;font-weight:800;font-style:italic;color:var(--pink-2)}
  .random-label .sub{font-family:var(--font-body);font-size:0.72rem;font-style:normal;font-weight:600;color:var(--fg-dimmer);text-transform:uppercase;letter-spacing:0.14em;margin-left:6px}
  .random-btn{padding:8px 18px;border-radius:2px;border:1px solid var(--pink-line);background:var(--pink-soft);color:var(--pink-2);font-family:var(--font-body);font-size:0.74rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all .18s}
  .random-btn:hover{background:var(--pink);color:#0a0a0f;border-color:var(--pink)}
  .random-slot{max-width:700px;margin:0 auto}
  .random-slot .style-card{display:flex !important;flex-direction:column}
  .random-slot .card-head{padding:22px 26px 14px}
  .random-slot .card-title{font-size:1.5rem;margin-bottom:8px}
  .random-slot .card-desc{font-size:0.88rem;-webkit-line-clamp:unset;display:block}
  .random-slot .carousel-wrap{margin:0 26px}
  .random-slot .prompt-block{padding:18px 26px 22px}
  .random-slot .prompt-code{height:140px;font-size:0.72rem;padding:14px 50px 14px 16px}
  .random-slot .prompt-tab{padding:12px 8px;font-size:0.72rem}

  /* ── LIGHTBOX ── */
  .lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:none;align-items:center;justify-content:center;backdrop-filter:blur(8px);padding:20px}
  .lightbox.open{display:flex}
  .lb-inner{position:relative;max-width:calc(100vw - 40px);max-height:calc(100vh - 40px);display:flex;align-items:center;justify-content:center}
  .lb-inner img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block;border-radius:2px}
  .lb-close{position:fixed;top:18px;right:24px;background:none;border:none;color:rgba(255,255,255,0.6);font-size:1.8rem;cursor:pointer;line-height:1;transition:color .15s;z-index:10001}
  .lb-close:hover{color:#fff}
  .lb-btn{position:fixed;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.6);color:rgba(255,255,255,0.75);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;z-index:10001}
  .lb-btn:hover{background:var(--pink);border-color:var(--pink);color:#fff}
  .lb-btn.lb-prev{left:18px}
  .lb-btn.lb-next{right:18px}
  .lb-btn:disabled{opacity:0.22;pointer-events:none}
  .lb-counter{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.55);font-family:var(--font-mono);font-size:0.78rem;z-index:10001}

  /* ── RESPONSIVE ── */
  @media(max-width:980px){.styles-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:640px){
    .styles-grid{grid-template-columns:minmax(0,1fr);gap:14px}
    .lightbox{padding:8px}
    .lb-inner{max-width:calc(100vw - 16px);max-height:calc(100vh - 100px)}
    .lb-close{top:10px;right:12px;font-size:1.6rem}
    .lb-counter{bottom:14px}
    .lb-btn{top:auto;bottom:60px;transform:none}
    .lb-btn.lb-prev{left:10px}
    .lb-btn.lb-next{right:10px}
    .filter-bar{padding:10px 14px;gap:8px}
    .search-wrap input{width:140px;font-size:0.72rem}
    .filter-btn{padding:6px 12px;font-size:0.7rem}
    .random-section{padding:30px 16px 60px}
    .lb-btn{width:38px;height:38px}
  }

  footer{text-align:center;padding:56px 20px 40px;color:var(--fg-dimmer);font-size:0.78rem;border-top:1px solid var(--border);font-family:var(--font-display);font-style:italic}
  footer::before{content:'★';display:block;color:var(--pink);font-size:1rem;margin-bottom:10px;font-style:normal}

  @media(max-width:720px){
    .hero{padding:40px 20px 30px}.hero-top{margin-bottom:36px}
    .hero-meta{gap:22px;margin-top:32px}
    .intro-wrap{padding:12px 20px 30px}.intro-card,.install-card{padding:28px 24px}
    .card-head{padding:24px 22px 16px;flex-direction:column;gap:14px}
    .card-badges{flex-direction:row;align-self:flex-start}
    .carousel-wrap{margin:0 22px}
    .prompt-block{padding:20px 22px 26px}
    .prompt-tab{padding:12px 8px;font-size:0.7rem}
    .styles-container{padding:32px 20px 80px;gap:40px}
    .install-step{gap:14px}.step-num{font-size:2rem;min-width:44px}
  }
</style>
</head>
<body>

<section class="hero">
  <div class="hero-banner"><img src="images/shapka.jpg" alt="slay images banner" loading="eager"></div>
  <div class="hero-top">
    <span class="brand-mark">Wewwa &middot; ${styles.length} styles</span>
    <div class="lang-toggle">
      <button class="lang-btn active" data-lang="ru">RU</button>
      <button class="lang-btn" data-lang="en">EN</button>
    </div>
  </div>
  <h1 class="hero-title"><i>slay</i> images<br><span class="and">&mdash;</span> style bible</h1>
  <p class="hero-tagline" data-ru="\u0421\u0442\u0438\u043B\u0435\u0432\u044B\u0435 \u043F\u0440\u0435\u0441\u0435\u0442\u044B \u0434\u043B\u044F inline-\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A \u0432 SillyTavern. \u0412\u044B\u0431\u0435\u0440\u0438 \u0441\u0442\u0438\u043B\u044C, \u0441\u043A\u043E\u043F\u0438\u0440\u0443\u0439 \u043F\u0440\u043E\u043C\u043F\u0442, slay." data-en="Style presets for inline image generation in SillyTavern. Pick a style, copy the prompt, slay.">\u0421\u0442\u0438\u043B\u0435\u0432\u044B\u0435 \u043F\u0440\u0435\u0441\u0435\u0442\u044B \u0434\u043B\u044F inline-\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A \u0432 SillyTavern. \u0412\u044B\u0431\u0435\u0440\u0438 \u0441\u0442\u0438\u043B\u044C, \u0441\u043A\u043E\u043F\u0438\u0440\u0443\u0439 \u043F\u0440\u043E\u043C\u043F\u0442, slay.</p>
  <div class="hero-meta">
    <div class="hero-meta-item"><span class="hero-meta-num">${styles.length}</span><span class="hero-meta-label" data-ru="\u0441\u0442\u0438\u043B\u0435\u0439" data-en="styles">\u0441\u0442\u0438\u043B\u0435\u0439</span></div>
    <div class="hero-meta-item"><span class="hero-meta-num">4</span><span class="hero-meta-label" data-ru="\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u043F\u0440\u043E\u043C\u043F\u0442\u0430" data-en="prompt variants">\u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u043F\u0440\u043E\u043C\u043F\u0442\u0430</div>
    <div class="hero-meta-item"><span class="hero-meta-num">8</span><span class="hero-meta-label" data-ru="\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439" data-en="categories">\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439</span></div>
  </div>
</section>

<div class="intro-wrap">
  <article class="intro-card">
    <div class="intro-kicker" data-ru="\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0435" data-en="about">\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0435</div>
    <h2 data-ru="\u041F\u0440\u0438\u0432\u0435\u0442!" data-en="Hi!">\u041F\u0440\u0438\u0432\u0435\u0442!</h2>
    <p data-ru="\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 <a href='https://t.me/wewwajai' target='_blank'>Wewwa</a>, \u0438 \u044D\u0442\u043E\u0442 \u0441\u0430\u0439\u0442 &mdash; \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043D\u0430\u0448\u0435\u0439 \u0441 \u0442\u0435\u0441\u0442\u0435\u0440\u0430\u043C\u0438 \u0440\u0430\u0431\u043E\u0442\u044B \u043D\u0430\u0434 \u0440\u0430\u0437\u043D\u044B\u043C\u0438 \u0441\u0442\u0438\u043B\u044F\u043C\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A \u0434\u043B\u044F \u0432\u0430\u0448\u0438\u0445 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0439." data-en="I'm <a href='https://t.me/wewwajai' target='_blank'>Wewwa</a>, and this site is the result of me and my testers working on DIFFERENT image styles for your generations.">\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 <a href="https://t.me/wewwajai" target="_blank">Wewwa</a>, \u0438 \u044D\u0442\u043E\u0442 \u0441\u0430\u0439\u0442 &mdash; \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043D\u0430\u0448\u0435\u0439 \u0441 \u0442\u0435\u0441\u0442\u0435\u0440\u0430\u043C\u0438 \u0440\u0430\u0431\u043E\u0442\u044B \u043D\u0430\u0434 \u0440\u0430\u0437\u043D\u044B\u043C\u0438 \u0441\u0442\u0438\u043B\u044F\u043C\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A \u0434\u043B\u044F \u0432\u0430\u0448\u0438\u0445 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0439.</p>
    <span class="love" data-ru="\u043A\u043E\u0442\u044F\u0442\u0430 \u0442\u0435\u0441\u0442\u0435\u0440\u044B, \u044F \u0432\u0430\u0441 \u043E\u0447\u0435\u043D\u044C \u043B\u044E\u0431\u043B\u044E \u0434\u043E \u041B\u0443\u043D\u044B \u0438 \u043E\u0431\u0440\u0430\u0442\u043D\u043E \u0442\u044B\u0441\u044F\u0447\u0438 \u0440\u0430\u0437! \u0441\u043F\u0430\u0441\u0438\u0431\u043E! \u0431\u0435\u0437 \u0432\u0430\u0441 \u044F \u0431\u044B \u043D\u0435 \u0441\u043F\u0440\u0430\u0432\u0438\u043B\u0430\u0441\u044C" data-en="my testing kittens, I love you to the Moon and back a thousand times! thank you! without you I couldn't have done it">\u043A\u043E\u0442\u044F\u0442\u0430 \u0442\u0435\u0441\u0442\u0435\u0440\u044B, \u044F \u0432\u0430\u0441 \u043E\u0447\u0435\u043D\u044C \u043B\u044E\u0431\u043B\u044E \u0434\u043E \u041B\u0443\u043D\u044B \u0438 \u043E\u0431\u0440\u0430\u0442\u043D\u043E \u0442\u044B\u0441\u044F\u0447\u0438 \u0440\u0430\u0437! \u0441\u043F\u0430\u0441\u0438\u0431\u043E! \u0431\u0435\u0437 \u0432\u0430\u0441 \u044F \u0431\u044B \u043D\u0435 \u0441\u043F\u0440\u0430\u0432\u0438\u043B\u0430\u0441\u044C</span>
    <p data-ru="\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043E\u0441\u043D\u043E\u0432\u0430\u043D\u044B \u043D\u0430 \u043F\u0440\u043E\u043C\u0442\u0435 \u0434\u043B\u044F <a href='https://github.com/aceenvw/notsosillynotsoimages' target='_blank'>notsosillynotsoimages</a> \u0437\u0430 \u0430\u0432\u0442\u043E\u0440\u0441\u0442\u0432\u043E\u043C <a href='https://t.me/aceeenvw' target='_blank'>aceenvw</a> \u0438 <a href='https://t.me/sillykamoi' target='_blank'>kamoi</a> (\u0441\u043A\u0435\u043B\u0435\u0442 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0438\u0442 \u0438\u043C, \u0432\u0441\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 &mdash; \u043C\u0443\u0447\u0435\u043D\u0438\u044F \u0438 \u0441\u0442\u0430\u0440\u0430\u043D\u0438\u044F \u043C\u0435\u043D\u044F, \u0442\u0435\u0441\u0442\u0435\u0440\u043E\u0432 \u0438 \u043F\u043E\u043F\u0443\u0441\u0430)" data-en="Generations are based on the prompt for <a href='https://github.com/aceenvw/notsosillynotsoimages' target='_blank'>notsosillynotsoimages</a> by <a href='https://t.me/aceeenvw' target='_blank'>aceenvw</a> and <a href='https://t.me/sillykamoi' target='_blank'>kamoi</a> (the skeleton structure is theirs, the rest is me, the testers and Opus, suffering and trying)">\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043E\u0441\u043D\u043E\u0432\u0430\u043D\u044B \u043D\u0430 \u043F\u0440\u043E\u043C\u0442\u0435 \u0434\u043B\u044F <a href="https://github.com/aceenvw/notsosillynotsoimages" target="_blank">notsosillynotsoimages</a> \u0437\u0430 \u0430\u0432\u0442\u043E\u0440\u0441\u0442\u0432\u043E\u043C <a href="https://t.me/aceeenvw" target="_blank">aceenvw</a> \u0438 <a href="https://t.me/sillykamoi" target="_blank">kamoi</a> (\u0441\u043A\u0435\u043B\u0435\u0442 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u0438\u0442 \u0438\u043C, \u0432\u0441\u0435 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 &mdash; \u043C\u0443\u0447\u0435\u043D\u0438\u044F \u0438 \u0441\u0442\u0430\u0440\u0430\u043D\u0438\u044F \u043C\u0435\u043D\u044F, \u0442\u0435\u0441\u0442\u0435\u0440\u043E\u0432 \u0438 \u043F\u043E\u043F\u0443\u0441\u0430)</p>
    <p data-ru="\u0422\u043E\u0433\u0433\u043B\u044B \u043F\u043E\u0434\u043E\u0439\u0434\u0443\u0442 \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043B\u044E\u0431\u044B\u043C\u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F\u043C\u0438, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u0434\u043B\u044F Inline-\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043E\u043F\u0438\u0440\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u043D\u0430\u043B\u0438\u0447\u0438\u0435 \u043D\u0438\u043A\u043D\u0435\u0439\u043C\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430 \u0432 \u0447\u0430\u0442\u0435. \u0412 \u043F\u0435\u0440\u0432\u0443\u044E \u043E\u0447\u0435\u0440\u0435\u0434\u044C, \u044F \u0434\u0435\u043B\u0430\u043B\u0430 \u044D\u0442\u043E \u0434\u043B\u044F \u043C\u043E\u0435\u0433\u043E \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F <a href='https://github.com/wewwaistyping/SLAYimages' target='_blank'>SLAY images</a>, \u043D\u043E \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u044D\u0442\u043E \u043D\u0430 \u043B\u044E\u0431\u043E\u043C \u0434\u0440\u0443\u0433\u043E\u043C \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0438, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043F\u043E\u0434\u0442\u044F\u0433\u0438\u0432\u0430\u0435\u0442 \u0438\u043C\u0435\u043D\u0430 {{char}}, {{user}} \u0438\u043B\u0438 NPC." data-en="These toggles work with any extension for inline image generation that relies on the character nickname in chat. I made these primarily for my extension <a href='https://github.com/wewwaistyping/SLAYimages' target='_blank'>SLAY images</a>, but you can use them with any other generation extension that picks up {{char}}, {{user}} or NPC names.">\u0422\u043E\u0433\u0433\u043B\u044B \u043F\u043E\u0434\u043E\u0439\u0434\u0443\u0442 \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043B\u044E\u0431\u044B\u043C\u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F\u043C\u0438, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u0434\u043B\u044F Inline-\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u043A, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043E\u043F\u0438\u0440\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u043D\u0430\u043B\u0438\u0447\u0438\u0435 \u043D\u0438\u043A\u043D\u0435\u0439\u043C\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u0436\u0430 \u0432 \u0447\u0430\u0442\u0435. \u0412 \u043F\u0435\u0440\u0432\u0443\u044E \u043E\u0447\u0435\u0440\u0435\u0434\u044C, \u044F \u0434\u0435\u043B\u0430\u043B\u0430 \u044D\u0442\u043E \u0434\u043B\u044F \u043C\u043E\u0435\u0433\u043E \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F <a href="https://github.com/wewwaistyping/SLAYimages" target="_blank">SLAY images</a>, \u043D\u043E \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u044D\u0442\u043E \u043D\u0430 \u043B\u044E\u0431\u043E\u043C \u0434\u0440\u0443\u0433\u043E\u043C \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0438, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043F\u043E\u0434\u0442\u044F\u0433\u0438\u0432\u0430\u0435\u0442 \u0438\u043C\u0435\u043D\u0430 {{char}}, {{user}} \u0438\u043B\u0438 NPC.</p>
    <p data-ru="\u0412\u044B \u0442\u0430\u043A\u0436\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0432 \u0433\u0435\u043C\u0438\u043D\u0438/\u0433\u0434\u0435-\u0443\u0433\u043E\u0434\u043D\u043E-\u0435\u0449\u0435, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F \u043A\u043E\u0434 \u0438\u0437 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 Gemini. \u041A\u0430\u043A \u043F\u0440\u043E\u043C\u0442\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u044F \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u043B\u0430 <a href='https://teletype.in/@wewwa/generations' target='_blank'>\u0432\u043E\u0442 \u0442\u0443\u0442</a>." data-en="You can also generate individual images in Gemini or anywhere else using the code from the Gemini tab. I wrote about how to prompt images <a href='https://teletype.in/@wewwa/generations' target='_blank'>here</a>.">\u0412\u044B \u0442\u0430\u043A\u0436\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0432 \u0433\u0435\u043C\u0438\u043D\u0438/\u0433\u0434\u0435-\u0443\u0433\u043E\u0434\u043D\u043E-\u0435\u0449\u0435, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F \u043A\u043E\u0434 \u0438\u0437 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 Gemini. \u041A\u0430\u043A \u043F\u0440\u043E\u043C\u0442\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u044F \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u043B\u0430 <a href="https://teletype.in/@wewwa/generations" target="_blank">\u0432\u043E\u0442 \u0442\u0443\u0442</a>.</p>
    <p data-ru="\u0414\u043B\u044F Tavo \u0435\u0441\u0442\u044C \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E \u0441 \u043F\u0440\u043E\u043C\u0442\u043E\u043C (\u0441\u0434\u0435\u043B\u0430\u043D\u043E \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u0442\u0438\u043B\u0435\u0439 \u0432 \u043B\u043E\u0440\u0431\u0443\u043A\u0435 <a href='https://t.me/ah_ah_shino4ka' target='_blank'>\u0428\u0438\u043D\u043E</a>, \u043F\u0440\u043E\u0441\u0442\u043E \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u043F\u0438\u0441\u044C \u0441\u043E \u0441\u0442\u0438\u043B\u0435\u043C/\u043F\u043E\u043C\u0435\u043D\u044F\u0439\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u043B\u044E\u0431\u043E\u0439 \u0438\u043C\u0435\u044E\u0449\u0435\u0439\u0441\u044F)." data-en="For Tavo there is a separate prompt window (based on <a href='https://t.me/ah_ah_shino4ka' target='_blank'>Shino</a> lorebook styles &mdash; just add an entry with the style or change the text of any existing one).">\u0414\u043B\u044F Tavo \u0435\u0441\u0442\u044C \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E \u0441 \u043F\u0440\u043E\u043C\u0442\u043E\u043C (\u0441\u0434\u0435\u043B\u0430\u043D\u043E \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u0442\u0438\u043B\u0435\u0439 \u0432 \u043B\u043E\u0440\u0431\u0443\u043A\u0435 <a href='https://t.me/ah_ah_shino4ka' target='_blank'>\u0428\u0438\u043D\u043E</a>, \u043F\u0440\u043E\u0441\u0442\u043E \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u043F\u0438\u0441\u044C \u0441\u043E \u0441\u0442\u0438\u043B\u0435\u043C/\u043F\u043E\u043C\u0435\u043D\u044F\u0439\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u043B\u044E\u0431\u043E\u0439 \u0438\u043C\u0435\u044E\u0449\u0435\u0439\u0441\u044F).</p>
    <div class="intro-faq">
      <strong data-ru="\u041f\u043e\u0447\u0435\u043c\u0443 full \u043f\u0440\u043e\u043c\u0442\u044b \u0442\u0430\u043a\u0438\u0435 \u0431\u043e\u043b\u044c\u0448\u0438\u0435?" data-en="Why are full prompts so big?">\u041f\u043e\u0447\u0435\u043c\u0443 full \u043f\u0440\u043e\u043c\u0442\u044b \u0442\u0430\u043a\u0438\u0435 \u0431\u043e\u043b\u044c\u0448\u0438\u0435?</strong>
      <p data-ru="\u041f\u043e\u0442\u043e\u043c\u0443 \u0447\u0442\u043e \u0432 \u043d\u0438\u0445 \u0431\u043e\u043b\u044c\u0448\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0439, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0442 \u043c\u043e\u0434\u0435\u043b\u044c \u2014 \u044d\u0442\u043e \u0434\u0430\u0451\u0442 \u0431\u043e\u043b\u0435\u0435 \u043b\u043e\u0433\u0438\u0447\u043d\u044b\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442. \u0412\u044b \u0432\u0441\u0451 \u0435\u0449\u0451 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e \u043c\u043e\u0436\u0435\u0442\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 \u043f\u0440\u043e\u043c\u0442\u043e\u0432." data-en="Because they contain more instructions guiding the model &mdash; this yields a more consistent result. You can still use the short versions of the prompts just fine.">\u041f\u043e\u0442\u043e\u043c\u0443 \u0447\u0442\u043e \u0432 \u043d\u0438\u0445 \u0431\u043e\u043b\u044c\u0448\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0439, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0442 \u043c\u043e\u0434\u0435\u043b\u044c \u2014 \u044d\u0442\u043e \u0434\u0430\u0451\u0442 \u0431\u043e\u043b\u0435\u0435 \u043b\u043e\u0433\u0438\u0447\u043d\u044b\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442. \u0412\u044b \u0432\u0441\u0451 \u0435\u0449\u0451 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e \u043c\u043e\u0436\u0435\u0442\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 \u043f\u0440\u043e\u043c\u0442\u043e\u0432.</p>
    </div>
    <div class="intro-warn">
      <strong data-ru="\u0412\u041D\u0418\u041C\u0410\u041D\u0418\u0415" data-en="ATTENTION">\u0412\u041D\u0418\u041C\u0410\u041D\u0418\u0415</strong>
      <ol>
        <li data-ru="Tavo \u2014 \u0421\u0423\u041f\u0415\u0420-\u042d\u041a\u0421\u041f\u0415\u0420\u0418\u041c\u0415\u041d\u0422\u0410\u041b\u042c\u041d\u041e, \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u044e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043f\u0440\u043e\u0441\u0442\u044b\u0435/stable \u0441\u0442\u0438\u043b\u0438. \u042d\u0442\u043e \u041d\u0415 \u041f\u041e\u041b\u041d\u042b\u0419 \u041f\u0420\u041e\u041c\u0422, \u0422\u041e\u041b\u042c\u041a\u041e \u0421\u0422\u0418\u041b\u042c." data-en="Tavo \u2014 SUPER-EXPERIMENTAL, recommended to use simple/stable styles. This is NOT a FULL PROMPT, ONLY THE STYLE.">Tavo \u2014 \u0421\u0423\u041f\u0415\u0420-\u042d\u041a\u0421\u041f\u0415\u0420\u0418\u041c\u0415\u041d\u0422\u0410\u041b\u042c\u041d\u041e, \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u044e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043f\u0440\u043e\u0441\u0442\u044b\u0435/stable \u0441\u0442\u0438\u043b\u0438. \u042d\u0442\u043e \u041d\u0415 \u041f\u041e\u041b\u041d\u042b\u0419 \u041f\u0420\u041e\u041c\u0422, \u0422\u041e\u041b\u042c\u041a\u041e \u0421\u0422\u0418\u041b\u042c.</li>
        <li data-ru="\u0412\u0441\u0435 \u043f\u0440\u043e\u043c\u0442\u044b \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043b\u0438\u0441\u044c \u043d\u0430 nanobanana/gemini, \u043c\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u043c \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c, \u0447\u0442\u043e \u043e\u043d\u0438 \u0431\u0443\u0434\u0443\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u043d\u0430 \u043b\u044e\u0431\u044b\u0445 \u0434\u0440\u0443\u0433\u0438\u0445 \u043d\u0435\u0439\u0440\u043e\u043d\u043a\u0430\u0445." data-en="All prompts were tested on nanobanana/gemini \u2014 we cannot guarantee they work on any other models.">\u0412\u0441\u0435 \u043f\u0440\u043e\u043c\u0442\u044b \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043b\u0438\u0441\u044c \u043d\u0430 nanobanana/gemini, \u043c\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u043c \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c, \u0447\u0442\u043e \u043e\u043d\u0438 \u0431\u0443\u0434\u0443\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u043d\u0430 \u043b\u044e\u0431\u044b\u0445 \u0434\u0440\u0443\u0433\u0438\u0445 \u043d\u0435\u0439\u0440\u043e\u043d\u043a\u0430\u0445.</li>
        <li data-ru="\u041e\u0441\u0442\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438, \u0435\u0441\u043b\u0438 \u0447\u0442\u043e-\u0442\u043e \u043d\u0435 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u2014 \u043f\u043e\u0441\u0442\u0430\u0440\u0430\u0435\u043c\u0441\u044f \u0440\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c\u0441\u044f." data-en="Leave comments if something doesn't work \u2014 we'll try to figure it out.">\u041e\u0441\u0442\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438, \u0435\u0441\u043b\u0438 \u0447\u0442\u043e-\u0442\u043e \u043d\u0435 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u2014 \u043f\u043e\u0441\u0442\u0430\u0440\u0430\u0435\u043c\u0441\u044f \u0440\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c\u0441\u044f.</li>
      </ol>
    </div>
  </article>

  <details class="install-card">
    <summary class="install-summary">
      <div class="intro-kicker" data-ru="\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430" data-en="installation">\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430</div>
      <h2 data-ru="\u041A\u0430\u043A \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0432 \u0422\u0430\u0432\u0435\u0440\u043D\u0443?" data-en="How to install in SillyTavern?">\u041A\u0430\u043A \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0432 \u0422\u0430\u0432\u0435\u0440\u043D\u0443?</h2>
      <span class="install-arrow">\u25BE</span>
    </summary>
    <div class="install-content">
    <div class="install-steps">
      <div class="install-step">
        <span class="step-num">I</span>
        <div class="step-body">
          <h3 data-ru="\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u043D\u0435\u043D\u0443\u0436\u043D\u043E\u0433\u043E HTML-\u0442\u043E\u0433\u043B\u0430" data-en="Replace contents of an unused HTML toggle">\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u043D\u0435\u043D\u0443\u0436\u043D\u043E\u0433\u043E HTML-\u0442\u043E\u0433\u043B\u0430</h3>
          <p data-ru="\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u043B\u044E\u0431\u043E\u0433\u043E \u043D\u0435\u043D\u0443\u0436\u043D\u043E\u0433\u043E \u0432\u0430\u043C html-\u0442\u043E\u0433\u043B\u0430 \u043D\u0430 \u0442\u043E\u0442, \u0447\u0442\u043E \u043F\u043E\u0434\u043E\u0431\u0440\u0430\u043B\u0438 \u0442\u0443\u0442. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u043E\u0433\u043B html \u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438, \u0435\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u0441\u0442\u043E\u044F\u043B \u043A\u0430\u043A\u043E\u0439-\u0442\u043E \u0434\u0440\u0443\u0433\u043E\u0439." data-en="Replace the contents of any unused HTML toggle with the one you picked here. Enable it. Don't forget to disable any other image toggle you had enabled.">\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u043B\u044E\u0431\u043E\u0433\u043E \u043D\u0435\u043D\u0443\u0436\u043D\u043E\u0433\u043E \u0432\u0430\u043C html-\u0442\u043E\u0433\u043B\u0430 \u043D\u0430 \u0442\u043E\u0442, \u0447\u0442\u043E \u043F\u043E\u0434\u043E\u0431\u0440\u0430\u043B\u0438 \u0442\u0443\u0442. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u043E\u0433\u043B html \u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438, \u0435\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u0441\u0442\u043E\u044F\u043B \u043A\u0430\u043A\u043E\u0439-\u0442\u043E \u0434\u0440\u0443\u0433\u043E\u0439.</p>
        </div>
      </div>
      <div class="install-step">
        <span class="step-num">II</span>
        <div class="step-body">
          <h3 data-ru="\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0432\u043E\u0439 HTML-\u0442\u043E\u0433\u043B" data-en="Create your own HTML toggle">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0432\u043E\u0439 HTML-\u0442\u043E\u0433\u043B</h3>
          <p data-ru="\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0441\u0432\u043E\u0439 html \u0442\u043E\u0433\u043B (\u0441\u043C\u043E\u0442\u0440\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443 \u043D\u0438\u0436\u0435)." data-en="Create your own HTML toggle (see the image below).">\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0441\u0432\u043E\u0439 html \u0442\u043E\u0433\u043B (\u0441\u043C\u043E\u0442\u0440\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443 \u043D\u0438\u0436\u0435).</p>
        </div>
      </div>
    </div>
    <div class="install-image">
      <img src="images/guide.jpg" alt="install guide" loading="lazy">
    </div>
    </div>
  </details>
</div>

<nav class="filter-bar">
  <div class="filter-bar-inner">
    <div class="filter-group">
    <button class="filter-btn active" data-filter="all" data-ru="\u0412\u0441\u0435" data-en="All">\u0412\u0441\u0435</button>
    <button class="filter-btn" data-filter="painting" data-ru="\u0416\u0438\u0432\u043E\u043F\u0438\u0441\u044C" data-en="Painting">\u0416\u0438\u0432\u043E\u043F\u0438\u0441\u044C</button>
    <button class="filter-btn" data-filter="illustration" data-ru="\u0418\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u044F" data-en="Illustration">\u0418\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u044F</button>
    <button class="filter-btn" data-filter="film" data-ru="\u041A\u0438\u043D\u043E \u0438 \u0444\u043E\u0442\u043E" data-en="Film &amp; Photo">\u041A\u0438\u043D\u043E \u0438 \u0444\u043E\u0442\u043E</button>
    <button class="filter-btn" data-filter="game" data-ru="\u0412\u0438\u0434\u0435\u043E\u0438\u0433\u0440\u044B" data-en="Video Games">\u0412\u0438\u0434\u0435\u043E\u0438\u0433\u0440\u044B</button>
    <button class="filter-btn" data-filter="cartoon" data-ru="\u041C\u0443\u043B\u044C\u0442\u044B" data-en="Cartoons">\u041C\u0443\u043B\u044C\u0442\u044B</button>
    <button class="filter-btn" data-filter="anime" data-ru="\u0410\u043D\u0438\u043C\u0435 \u0438 \u043C\u0430\u043D\u0433\u0430" data-en="Anime &amp; Manga">\u0410\u043D\u0438\u043C\u0435 \u0438 \u043C\u0430\u043D\u0433\u0430</button>
    <button class="filter-btn" data-filter="print" data-ru="\u0413\u0440\u0430\u0444\u0438\u043A\u0430" data-en="Print &amp; Graphic">\u0413\u0440\u0430\u0444\u0438\u043A\u0430</button>
    <button class="filter-btn" data-filter="3d" data-ru="3D \u0438 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044F" data-en="3D &amp; Animation">3D \u0438 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044F</button>
    </div>
    <div class="search-wrap"><input type="text" id="searchInput" placeholder="\u041F\u043E\u0438\u0441\u043A..." autocomplete="off"></div>
  </div>
</nav>

<main class="styles-container">
  <div class="styles-grid" id="stylesGrid">
${cards}
  </div>
  <div class="pagination-wrap" id="paginationWrap"></div>
</main>

<section class="random-section" id="randomSection">
  <div class="random-header">
    <div class="random-label"><span data-ru="\u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C" data-en="random style">\u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C</span><span class="sub" data-ru="\u043D\u0443 \u0447\u0451, \u0440\u0443\u043B\u0435\u0442\u043A\u0430?" data-en="feeling lucky?">\u043D\u0443 \u0447\u0451, \u0440\u0443\u043B\u0435\u0442\u043A\u0430?</span></div>
    <button class="random-btn" id="randomBtn" data-ru="\u{1F3B2} \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u0442\u0438\u043B\u044C" data-en="\u{1F3B2} shuffle">\u{1F3B2} \u0434\u0440\u0443\u0433\u043E\u0439 \u0441\u0442\u0438\u043B\u044C</button>
  </div>
  <div class="random-slot" id="randomSlot"></div>
</section>

<footer data-ru="\u0441\u0434\u0435\u043B\u0430\u043D\u043E \u0441 \u043B\u044E\u0431\u043E\u0432\u044C\u044E wewwa \u0438 \u0442\u0435\u0441\u0442\u0438\u0440\u0443\u044E\u0449\u0438\u043C\u0438 \u043A\u043E\u0442\u044F\u0442\u0430\u043C\u0438" data-en="made with love by wewwa &amp; the testing kittens">\u0441\u0434\u0435\u043B\u0430\u043D\u043E \u0441 \u043B\u044E\u0431\u043E\u0432\u044C\u044E wewwa \u0438 \u0442\u0435\u0441\u0442\u0438\u0440\u0443\u044E\u0449\u0438\u043C\u0438 \u043A\u043E\u0442\u044F\u0442\u0430\u043C\u0438</footer>

<div class="lightbox" id="lightbox">
  <button class="lb-close" id="lbClose">\u2715</button>
  <button class="lb-btn lb-prev" id="lbPrev">\u2039</button>
  <div class="lb-inner"><img id="lbImg" src="" alt=""></div>
  <button class="lb-btn lb-next" id="lbNext">\u203A</button>
  <div class="lb-counter" id="lbCounter"></div>
</div>
<script>
// Language toggle
let currentLang = 'ru';
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.querySelectorAll('[data-ru][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    // Use innerHTML for elements that may contain HTML entities or tags (links, paragraphs, captions, footer)
    if (/[<&]/.test(val)) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
  document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';
}
document.querySelectorAll('.lang-btn').forEach(b => {
  b.addEventListener('click', () => setLang(b.dataset.lang));
});

// ═══ Card initializer (for both static cards and cloned random card) ═══
function initCarousel(wrap){
  const t = wrap.querySelector('.carousel-track');
  const imgs = t.querySelectorAll('img');
  const phs = t.querySelectorAll('.carousel-placeholder');
  const items = [...imgs, ...phs];
  const dotsEl = wrap.nextElementSibling && wrap.nextElementSibling.classList.contains('carousel-dots') ? wrap.nextElementSibling : null;
  if (items.length < 2) {
    wrap.querySelectorAll('.carousel-btn').forEach(b => b.style.display = 'none');
    // still add counter label for 1-img case? no, skip.
    return { items, cur: () => 0 };
  }
  // counter
  let counter = wrap.querySelector('.carousel-counter');
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'carousel-counter';
    wrap.appendChild(counter);
  }
  let i = 0;
  if (dotsEl && dotsEl.children.length === 0) {
    items.forEach((_, j) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (j === 0 ? ' active' : '');
      dot.addEventListener('click', (e) => { e.stopPropagation(); go(j); });
      dotsEl.appendChild(dot);
    });
  }
  function go(n) {
    i = (n + items.length) % items.length;
    t.style.transform = 'translateX(-' + (i * 100) + '%)';
    if (dotsEl) dotsEl.querySelectorAll('.carousel-dot').forEach((d, j) => d.classList.toggle('active', j === i));
    counter.textContent = (i + 1) + ' / ' + items.length;
    const prevBtn = wrap.querySelector('.carousel-btn.prev');
    const nextBtn = wrap.querySelector('.carousel-btn.next');
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }
  go(0);
  const prevBtn = wrap.querySelector('.carousel-btn.prev');
  const nextBtn = wrap.querySelector('.carousel-btn.next');
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(i - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(i + 1); });
  // click the wrap (on image/track) → open lightbox
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.carousel-btn')) return;
    const allImgs = [...wrap.querySelectorAll('.carousel-track img')].map(im => im.src);
    if (allImgs.length === 0) return;
    openLightbox(allImgs, i);
  });
  return { items, cur: () => i };
}

function initCopy(card){
  card.querySelectorAll('[data-copy]').forEach(b => {
    b.addEventListener('click', async () => {
      const c = b.closest('.prompt-panel').querySelector('.prompt-code');
      const ok = await doCopy(c.textContent.trim());
      const copied = currentLang === 'ru' ? '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E!' : 'Copied!';
      const failed = currentLang === 'ru' ? '\u041E\u0448\u0438\u0431\u043A\u0430' : 'Failed';
      b.textContent = ok ? copied : failed;
      if (ok) b.classList.add('copied');
      setTimeout(() => { b.textContent = b.getAttribute('data-' + currentLang); b.classList.remove('copied'); }, 1800);
    });
  });
}

function initTabs(card){
  const tabs = card.querySelectorAll('.prompt-tab');
  const panels = card.querySelectorAll('.prompt-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(pp => pp.classList.toggle('active', pp.dataset.panel === key));
    });
  });
}

function initCard(card){
  const carWrap = card.querySelector('.carousel-wrap');
  if (carWrap) initCarousel(carWrap);
  initCopy(card);
  initTabs(card);
}

function fallbackCopy(text){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(ta);return ok;}
async function doCopy(text){if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(text);return true;}catch(e){}}return fallbackCopy(text);}

// ═══ Init all cards ═══
const allCards = Array.from(document.querySelectorAll('#stylesGrid .style-card'));
allCards.forEach(initCard);

// ═══ Guide image → lightbox ═══
const guideImg = document.querySelector('.install-image img');
if (guideImg) {
  guideImg.addEventListener('click', function() {
    openLightbox([guideImg.src], 0);
  });
}

// ═══ App state ═══
const PER_PAGE = 9;
let currentPage = 0;
let currentTag = 'all';
let currentSearch = '';

function filteredCards(){
  const q = currentSearch.toLowerCase().trim();
  return allCards.filter(c => {
    const tagOk = currentTag === 'all' || (c.dataset.tags && c.dataset.tags.includes(currentTag));
    if (!tagOk) return false;
    if (!q) return true;
    const name = c.querySelector('.card-title') ? c.querySelector('.card-title').textContent.toLowerCase() : '';
    const desc = c.querySelector('.card-desc') ? c.querySelector('.card-desc').textContent.toLowerCase() : '';
    return name.includes(q) || desc.includes(q);
  });
}

function renderGrid(){
  const grid = document.getElementById('stylesGrid');
  const list = filteredCards();
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  if (currentPage >= totalPages) currentPage = totalPages - 1;
  if (currentPage < 0) currentPage = 0;

  // hide all, show page slice
  allCards.forEach(c => c.classList.remove('visible'));
  // remove existing no-results
  const existingNR = grid.querySelector('.no-results');
  if (existingNR) existingNR.remove();

  if (list.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'no-results';
    msg.textContent = currentLang === 'ru' ? '\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E' : 'No results found';
    grid.appendChild(msg);
  } else {
    const slice = list.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE);
    slice.forEach(c => c.classList.add('visible'));
  }

  renderPagination(list.length, totalPages);
}

function renderPagination(total, totalPages){
  const wrap = document.getElementById('paginationWrap');
  wrap.innerHTML = '';
  if (total === 0 || totalPages <= 1) return;

  const pag = document.createElement('div');
  pag.className = 'pagination';

  const prev = document.createElement('button');
  prev.className = 'pg-btn';
  prev.textContent = currentLang === 'ru' ? '\u2190 \u041F\u0440\u0435\u0434' : '\u2190 Prev';
  prev.disabled = currentPage === 0;
  prev.addEventListener('click', () => { currentPage--; renderGrid(); scrollToGrid(); });
  pag.appendChild(prev);

  for (let p2 = 0; p2 < totalPages; p2++) {
    if (totalPages > 7 && p2 > 1 && p2 < totalPages - 2 && Math.abs(p2 - currentPage) > 1) {
      if (p2 === 2 || p2 === totalPages - 2) {
        const dots = document.createElement('span');
        dots.className = 'pg-dots';
        dots.textContent = '\u2026';
        pag.appendChild(dots);
      }
      continue;
    }
    const btn = document.createElement('button');
    btn.className = 'pg-btn' + (p2 === currentPage ? ' active' : '');
    btn.textContent = p2 + 1;
    btn.addEventListener('click', ((pp) => () => { currentPage = pp; renderGrid(); scrollToGrid(); })(p2));
    pag.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'pg-btn';
  next.textContent = currentLang === 'ru' ? '\u0421\u043B\u0435\u0434 \u2192' : 'Next \u2192';
  next.disabled = currentPage === totalPages - 1;
  next.addEventListener('click', () => { currentPage++; renderGrid(); scrollToGrid(); });
  pag.appendChild(next);

  const info = document.createElement('div');
  info.className = 'pg-info';
  const shown = Math.min(PER_PAGE, total - currentPage * PER_PAGE);
  if (currentLang === 'ru') {
    info.textContent = '\u0441\u0442\u0440. ' + (currentPage + 1) + ' / ' + totalPages + ' \u00B7 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ' + shown + ' \u0438\u0437 ' + total + ' \u0441\u0442\u0438\u043B\u0435\u0439';
  } else {
    info.textContent = 'page ' + (currentPage + 1) + ' / ' + totalPages + ' \u00B7 showing ' + shown + ' of ' + total + ' styles';
  }
  wrap.appendChild(pag);
  wrap.appendChild(info);
}

function scrollToGrid(){
  const t = document.querySelector('.filter-bar');
  if (!t) return;
  window.scrollTo({ top: t.offsetTop - 5, behavior: 'smooth' });
}

// ═══ Filter + search handlers (override old ones) ═══
document.querySelectorAll('.filter-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    currentTag = b.dataset.filter;
    currentPage = 0;
    renderGrid();
  });
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function(){
    currentSearch = this.value;
    currentPage = 0;
    renderGrid();
  });
}

// ═══ Random card ═══
function pickRandom(){
  const slot = document.getElementById('randomSlot');
  if (!slot || allCards.length === 0) return;
  // pick different from current
  const prevName = slot.querySelector('.card-title') ? slot.querySelector('.card-title').textContent : '';
  let pool = allCards;
  if (allCards.length > 1) {
    pool = allCards.filter(c => {
      const t = c.querySelector('.card-title');
      return t && t.textContent !== prevName;
    });
  }
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const clone = picked.cloneNode(true);
  clone.classList.add('visible');
  // reset active tab to first
  clone.querySelectorAll('.prompt-tab').forEach((t, ti) => t.classList.toggle('active', ti === 0));
  clone.querySelectorAll('.prompt-panel').forEach((pp, pi) => pp.classList.toggle('active', pi === 0));
  slot.innerHTML = '';
  slot.appendChild(clone);
  initCard(clone);
  // re-apply lang on clone
  clone.querySelectorAll('[data-ru][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + currentLang);
    if (val == null) return;
    if (/[<&]/.test(val)) el.innerHTML = val; else el.textContent = val;
  });
}
const randomBtn = document.getElementById('randomBtn');
if (randomBtn) randomBtn.addEventListener('click', pickRandom);

// ═══ Lightbox ═══
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbCounter = document.getElementById('lbCounter');
let lbList = [], lbIdx = 0;

function openLightbox(images, startIdx){
  lbList = images; lbIdx = startIdx || 0;
  showLb(lbIdx);
  // Desktop: compensate scrollbar width so content doesn't shift horizontally
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  lb.classList.add('open');
}
function showLb(n){
  lbIdx = Math.max(0, Math.min(lbList.length - 1, n));
  lbImg.src = lbList[lbIdx];
  lbPrev.disabled = lbIdx === 0;
  lbNext.disabled = lbIdx === lbList.length - 1;
  lbCounter.textContent = lbList.length > 1 ? ((lbIdx + 1) + ' / ' + lbList.length) : '';
}
function closeLb(){
  lb.classList.remove('open');
  document.body.style.paddingRight = '';
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  lbImg.src = '';
}
// iOS: overflow:hidden doesn't block touch scrolling, so also preventDefault on touchmove
document.addEventListener('touchmove', function(e){
  if (lb.classList.contains('open')) {
    if (!e.target.closest('.lb-btn, .lb-close, .lb-inner')) e.preventDefault();
  }
}, { passive: false });
document.getElementById('lbClose').addEventListener('click', closeLb);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
lbPrev.addEventListener('click', () => showLb(lbIdx - 1));
lbNext.addEventListener('click', () => showLb(lbIdx + 1));
document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
  if (e.key === 'ArrowRight') showLb(lbIdx + 1);
});

// ═══ Patch setLang to also re-render pagination text ═══
const _origSetLang = setLang;
setLang = function(lang){
  _origSetLang(lang);
  renderGrid();
  // Update search placeholder
  if (searchInput) searchInput.placeholder = lang === 'ru' ? '\u041F\u043E\u0438\u0441\u043A...' : 'Search...';
};

// ═══ Initial render ═══
renderGrid();
pickRandom();
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html, 'utf-8');
console.log('Generated index.html (' + Math.round(html.length / 1024) + ' KB) with ' + styles.length + ' styles');
