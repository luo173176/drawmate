import type { Course } from '@/types';

/**
 * 课程内容数据。
 * 每门课包含：目标、讲解、4 个步骤、课后练习、一张内置 SVG 参考图。
 * SVG 统一 viewBox="0 0 400 300"，线条用 currentColor，便于在亮/暗主题下以图片形式渲染。
 */

export const courses: Course[] = [
  {
    id: 'line-control',
    emoji: '🖊️',
    title: '线条控制',
    subtitle: '让手听话的第一步',
    difficulty: '入门',
    estimatedMinutes: 30,
    description:
      '一切造型的基础。通过连线、画圆与排线训练，让线条变得稳定、流畅、可控制。',
    goals: [
      '能画出方向可控的直线',
      '能徒手画出较圆的椭圆与圆',
      '掌握“先虚画再落笔”的起笔方法',
      '理解排线在造型中的作用',
    ],
    explanation: [
      '为什么从线条开始：线条是素描、速写与插画的共同底座。画短线靠手腕，画长线要靠手肘甚至肩部带动。落笔前先在纸面上方“虚画”两三遍（ghosting），确认方向和弧度后再轻轻触纸，这是职业画者也天天用的起笔方法。',
      '画错的线不要立刻擦：初学者最常见的习惯是反复描改，结果线条越来越毛糙。正确做法是轻下笔、敢越过交点，让线条“穿过去”，之后再整体清理。放松的、有出头迹象的线，远比缩手缩脚的碎线好看。',
      '排线是控笔的日常训练：用统一方向、等间距的斜线填满方框，间距均匀比画得快更重要。每天 5–10 分钟，两周就能看到线条明显变稳。',
    ],
    steps: [
      {
        id: 'line-control-step-1',
        title: '两点连线',
        description:
          '在纸上随机点两个点，用一笔把它们连起来。先虚画两遍找准方向，再正式下笔。从短距离（约 5cm）开始，逐渐拉长到整张纸的对角线。',
        tips: ['下笔前眼睛盯着终点而不是笔尖', '线画歪了就轻一点重画，不要原地描'],
      },
      {
        id: 'line-control-step-2',
        title: '圆与椭圆',
        description:
          '先画一个正方形做辅助框，在框内用四段弧线切出圆；熟练后丢掉辅助框直接徒手画。椭圆同理，注意长轴和短轴的方向要一致。',
        tips: ['转动纸张比硬掰手腕更容易画圆', '画椭圆时想象两个圆心错开的位置'],
      },
      {
        id: 'line-control-step-3',
        title: '等距排线',
        description:
          '画一个约 5cm 见方的方框，用 45° 斜线均匀填充，间距尽量一致。完成后换相反方向再来一组，最后练习两组叠加的交叉排线。',
        tips: ['手腕悬空，用小臂发力', '间距不均比线条歪更影响画面'],
      },
      {
        id: 'line-control-step-4',
        title: '长线一笔成型',
        description:
          '在纸的最左和最右各点一个点，深呼吸，用肩部带动一笔连接，中途不许停顿。这个练习为后面画透视线和大轮廓打基础。',
        tips: ['坐姿端正，手肘不要贴死桌面', '速度略快反而更容易画直'],
      },
    ],
    exercises: [
      '每天 1 页两点连线，每页不少于 20 条',
      '用徒手圆填满一页纸，圆与圆之间尽量不留大空隙',
      '选一个家里的静物（如水杯），只用长直线概括它的外轮廓，不涂明暗',
    ],
    reference: {
      id: 'line-control',
      title: '线条控制练习图',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <circle cx="40" cy="40" r="3" fill="currentColor"/><circle cx="360" cy="40" r="3" fill="currentColor"/>
  <path d="M40 40H360" stroke-dasharray="6 6"/>
  <circle cx="60" cy="75" r="3" fill="currentColor"/><circle cx="340" cy="95" r="3" fill="currentColor"/>
  <path d="M60 75L340 95" stroke-dasharray="6 6"/>
  <circle cx="40" cy="120" r="3" fill="currentColor"/><circle cx="360" cy="110" r="3" fill="currentColor"/>
  <path d="M40 120L360 110" stroke-dasharray="6 6"/>
  <path d="M40 165q30-30 60 0t60 0t60 0t60 0"/>
  <rect x="40" y="200" width="130" height="76" rx="4"/>
  <path d="M46 268L164 204M60 272L166 216M76 274L166 230M94 274L166 246M114 274L166 262M134 273L162 270"/>
  <circle cx="250" cy="238" r="38"/>
  <circle cx="250" cy="238" r="26" stroke-dasharray="5 5"/>
  <circle cx="250" cy="238" r="14" stroke-dasharray="5 5"/>
</svg>`,
    },
  },
  {
    id: 'basic-shapes',
    emoji: '🧊',
    title: '基本形状',
    subtitle: '把万物拆成几何体',
    difficulty: '入门',
    estimatedMinutes: 40,
    description:
      '学会用球体、立方体、圆柱、圆锥概括复杂物体，建立“先大形后细节”的造型顺序。',
    goals: [
      '理解“一切复杂物体都能拆成基本形状”',
      '能徒手画出球、立方体、圆柱、圆锥',
      '学会用形状概括法快速起稿',
    ],
    explanation: [
      '造型第一原则是概括：复杂的物体——一只猫、一辆车、一栋房子——都可以拆解成球体、方块、圆柱和圆锥的组合。先画大形状，再切小形状，最后加细节，这个顺序不能反。',
      '基本形状同时解决比例问题：直接抠细节容易画歪，而形状之间的大小比较非常直观——杯身是两个手腕宽，杯口椭圆是一个手腕高。用形状起稿，比例错得少，改起来也容易。',
      '圆柱是“椭圆 + 平行边”：圆柱的两个端面是椭圆，端面越接近视平线就越扁。这个规律在画杯子、瓶子、树干、手臂时全都用得上。',
    ],
    steps: [
      {
        id: 'basic-shapes-step-1',
        title: '球体与椭圆',
        description:
          '练习徒手画圆，再画不同压扁程度的椭圆。注意椭圆两端不能出现尖角，要用弧线平滑过渡。',
        tips: ['椭圆的四个顶点要与辅助十字相切', '椭圆越接近视平线越扁'],
      },
      {
        id: 'basic-shapes-step-2',
        title: '立方体与长方体',
        description:
          '先画一个正面正方形，再在斜方向画一个相同大小的正方形，连接对应顶点，就得到一个平行透视的长方体。之后练习画任意角度摆放的方块。',
        tips: ['看不见的三条边也轻轻画出来，有助于理解体积', '先保证每组对边平行'],
      },
      {
        id: 'basic-shapes-step-3',
        title: '圆柱与圆锥',
        description:
          '画两条平行竖线，上下各接一个椭圆，就是圆柱；把上端面缩成一个点，就是圆锥。练习把它们互相叠放、组合成新物体。',
        tips: ['先画中线再对称地画两边，形状不容易歪', '注意上下椭圆的扁度是否一致'],
      },
      {
        id: 'basic-shapes-step-4',
        title: '用形状概括实物',
        description:
          '找一个家里的物体（台灯、雨伞、书包），用 30 秒把它概括成 2–3 个基本形状的组合，再在此基础上逐步切出细节。',
        tips: ['第一遍只准画几何形状，禁止描细节', '概括完眯眼检查：大形像不像？'],
      },
    ],
    exercises: [
      '用方块 + 圆柱组合画出 3 种家居用品的草稿',
      '徒手画 10 个椭圆，要求长轴方向各不相同',
      '选一张产品照片，用基本形状快速临摹 3 遍',
    ],
    reference: {
      id: 'basic-shapes',
      title: '基本形状参考图',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="75" cy="90" r="45"/>
  <path d="M75 45v90M30 90h90" stroke-width="1.2" stroke-dasharray="4 4"/>
  <rect x="150" y="45" width="90" height="90" rx="4"/>
  <path d="M330 45l45 90h-90z"/>
  <ellipse cx="85" cy="205" rx="45" ry="14"/>
  <path d="M40 205v55a45 14 0 0 0 90 0v-55"/>
  <path d="M250 170l-45 92M250 170l45 92"/>
  <ellipse cx="250" cy="262" rx="45" ry="14"/>
</svg>`,
    },
  },
  {
    id: 'perspective-basics',
    emoji: '📐',
    title: '透视基础',
    subtitle: '在平面上画出空间',
    difficulty: '初级',
    estimatedMinutes: 50,
    description:
      '理解地平线、视平线与灭点，掌握一点透视与两点透视，让画面有了纵深和秩序。',
    goals: [
      '理解地平线、视平线与灭点的关系',
      '能用一点透视画房间',
      '能用两点透视画方块组合',
    ],
    explanation: [
      '透视解决的是“近大远小”如何量化：同样高的电线杆，越远越矮，最后消失在地平线上。灭点就是同一组平行线在画面中的汇聚点，而地平线的高度就是你眼睛的高度。',
      '一点透视适合表现纵深：面对一堵墙、一条走廊、一条马路时，只有一组线斜向灭点，其余横平竖直。先把灭点和地平线定下来，画面里所有物体的大小就都有了依据。',
      '两点透视更接近日常观察：站在街角看一栋楼，左右两组边线分别消失在左右两个灭点。垂直线永远垂直——这一点初学者最容易画歪。',
    ],
    steps: [
      {
        id: 'perspective-basics-step-1',
        title: '地平线与灭点',
        description:
          '在纸上画一条水平线作为地平线，在中点标一个灭点。从灭点向外放射画 8–12 条辅助线，感受“所有纵深都指向它”。',
        tips: ['地平线放低显得物体高大，放高则适合俯视场景', '辅助线要轻，方便后续擦除'],
      },
      {
        id: 'perspective-basics-step-2',
        title: '一点透视方块',
        description:
          '在地平线下方画一个正方形作为正面，从四个顶点向灭点引辅助线，在合适深度截断，画出背面四条边。再练习在地平线上方画几个。',
        tips: ['背面一定比正面小', '截断位置决定物体的长度'],
      },
      {
        id: 'perspective-basics-step-3',
        title: '一点透视房间',
        description:
          '把整张纸当作一个房间：纸张边界就是四面墙，在地平线上定好门窗的位置，所有纵深线都指向灭点。再摆一张桌子和一个柜子进去。',
        tips: ['先画大的墙面和地板，再添家具', '家具的纵深线同样指向灭点'],
      },
      {
        id: 'perspective-basics-step-4',
        title: '两点透视方块',
        description:
          '画地平线并在两端定两个灭点，画一条垂直线作为棱，分别向左右灭点引线并截断，补出垂直边。练习把 3 个高低不同的方块组合成街景。',
        tips: ['两个灭点距离要足够远，否则会畸变', '所有垂直线保持与纸边平行'],
      },
    ],
    exercises: [
      '用一点透视画自己的房间，至少包含门、窗、桌',
      '用两点透视画一排 3 栋高低不同的房子',
      '拍一张街景照片，对照找出它的地平线在哪里',
    ],
    reference: {
      id: 'perspective-basics',
      title: '透视基础参考图',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M30 150H370" stroke-width="1.5" stroke-dasharray="8 6"/>
  <circle cx="200" cy="150" r="4" fill="currentColor"/>
  <path d="M110 180L200 150M180 180L200 150M110 240L200 150M180 240L200 150M240 70L200 150M290 70L200 150M240 120L200 150M290 120L200 150" stroke-width="1.2" stroke-dasharray="4 4"/>
  <rect x="110" y="180" width="70" height="60"/>
  <path d="M155 165h35M190 165v30M155 195h35" />
  <path d="M155 165v30" stroke-dasharray="4 4"/>
  <rect x="240" y="70" width="50" height="50"/>
  <path d="M220 110h25M245 110v25M220 135h25"/>
  <path d="M220 110v25" stroke-dasharray="4 4"/>
</svg>`,
    },
  },
  {
    id: 'light-and-shadow',
    emoji: '💡',
    title: '明暗关系',
    subtitle: '用光塑造体积',
    difficulty: '初级',
    estimatedMinutes: 55,
    description:
      '认识三大面与五大调子，学会给球体画出完整的光影，并理解投影的形状与方向。',
    goals: [
      '理解三大面、五大调子的概念',
      '能给球体画出完整明暗关系',
      '理解投影的形状、方向与虚实',
    ],
    explanation: [
      '光的方向决定一切：定一个光源，物体向光的一面是亮部，背光的一面是暗部，交界处形成最深的明暗交界线。画明暗之前先问自己：光从哪里来？',
      '五大调子：高光、亮部（灰面）、明暗交界线、反光、投影。初学者常犯的错是把暗部画成一片死黑——暗部里也有反光和层次，只是整体更暗。牢记“亮部可以留白，暗部也要透气”。',
      '投影让物体“落地”：没有投影的物体像漂浮着。投影的方向与光源相反，形状受物体外形与地面起伏共同影响，靠近物体底部的地方最深、边缘最实，远端则越来越虚。',
    ],
    steps: [
      {
        id: 'light-and-shadow-step-1',
        title: '三大面',
        description:
          '画一个立方体，假定光从左上方来，把三个可见面分别处理成亮、灰、暗三个层次，对比要果断拉开。',
        tips: ['先眯起眼睛看整体，再决定每个面的深浅', '宁可对比过头，也不要灰蒙蒙一片'],
      },
      {
        id: 'light-and-shadow-step-2',
        title: '明暗交界线',
        description:
          '画一个圆，找到背光一侧的明暗交界线：它不是一条清晰的线，而是一条由深到浅的渐变带。沿交界线向亮部渐变提亮，向暗部渐变变浅。',
        tips: ['交界线在结构转折最激烈处最深', '用侧锋轻扫更容易做出渐变'],
      },
      {
        id: 'light-and-shadow-step-3',
        title: '球体完整光影',
        description:
          '完成一颗球：高光、灰面、明暗交界线、反光、投影一个不少。注意反光再亮也不能亮过灰面。',
        tips: ['用纸笔或手指揉擦让过渡柔和', '高光只留最小的一块'],
      },
      {
        id: 'light-and-shadow-step-4',
        title: '投影练习',
        description:
          '把球和立方体摆在一起，画出它们的投影。注意投影起点在物体与地面接触的地方，越远越虚。',
        tips: ['投影形状是物体外形的“拉伸”', '接触点处的投影最深最实'],
      },
    ],
    exercises: [
      '打一盏台灯照一个鸡蛋，画出它的五大调子',
      '给第 2 课画过的方块组合上明暗',
      '同一个物体分别在顶光、侧光下各画一张，对比差异',
    ],
    reference: {
      id: 'light-and-shadow',
      title: '球体明暗参考图',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <circle cx="190" cy="140" r="85"/>
  <circle cx="152" cy="100" r="13" stroke-width="1.5"/>
  <path d="M263.6 97.5A85 85 0 0 1 175.2 223.7" stroke-width="1.5"/>
  <path d="M258 104A77 77 0 0 1 179.3 216.2" stroke-width="1.5"/>
  <path d="M252 110A69 69 0 0 1 182.8 208.6" stroke-width="1.5"/>
  <path d="M245.7 115.2A61 61 0 0 1 185.7 200.8" stroke-width="1.5"/>
  <path d="M239.1 120.1A53 53 0 0 1 188.1 193" stroke-width="1.5"/>
  <path d="M232.3 124.6A45 45 0 0 1 190 185" stroke-width="1.5"/>
  <ellipse cx="212" cy="246" rx="82" ry="13" stroke-width="1.5"/>
  <path d="M58 42l40 40M98 82l-15-3M98 82l-3-15" stroke-width="1.5"/>
</svg>`,
    },
  },
  {
    id: 'color-basics',
    emoji: '🎨',
    title: '色彩基础',
    subtitle: '让颜色为画面服务',
    difficulty: '中级',
    estimatedMinutes: 45,
    description:
      '理解色相、明度、饱和度三属性，学会用色环做邻近色与互补色搭配，掌握冷暖对比。',
    goals: [
      '理解色相、明度、饱和度三属性',
      '会用色环找同类色、邻近色、对比色',
      '能判断并控制画面的冷暖倾向',
    ],
    explanation: [
      '色彩三属性：色相是“是什么颜色”，明度是“多亮”，饱和度是“多鲜艳”。初学者画面“脏”通常不是色相选错，而是饱和度失控——降低饱和度、拉开明度，画面立刻干净。',
      '色环是最实用的配色工具：色环上相邻 30°–60° 是邻近色，和谐安定；相对 180° 是互补色，对比强烈。经典的“蓝橙”配色就是互补色搭配，电影海报最爱用它。',
      '冷暖是相对的：在一片暖色里放一点冷色，冷色会成为视觉焦点。控制画面冷暖比例（大暖一小冷，或反之），比堆砌更多颜色更有效。',
    ],
    steps: [
      {
        id: 'color-basics-step-1',
        title: '认识色环',
        description:
          '用画笔软件或颜料做一个 12 色色环：三原色、二次色、三次色。记住它们的位置关系，配色时脑子里要有这张图。',
        tips: ['红黄蓝的调和顺序决定色彩倾向', '先把 12 个位置摆对，再谈调色'],
      },
      {
        id: 'color-basics-step-2',
        title: '三属性练习',
        description:
          '选一个颜色，分别只改变明度画一条 5 阶色阶条，只改变饱和度画一条 5 阶色阶条，感受两个维度的差别。',
        tips: ['明度拉开比色相变化更重要', '色阶之间要能明确分出层级'],
      },
      {
        id: 'color-basics-step-3',
        title: '邻近色与互补色',
        description:
          '用邻近色画一张小稿（如黄昏），再用互补色画同一构图（如蓝衣黄背景），对比两张的情绪差异。',
        tips: ['互补色并置时，把一方降饱和做主色', '互补色面积 7:3 左右最耐看'],
      },
      {
        id: 'color-basics-step-4',
        title: '冷暖焦点',
        description:
          '画一个以灰色调为主的小场景，只给主体物保留鲜艳的冷暖对比，观察视觉焦点是否立刻出现。',
        tips: ['鲜艳颜色面积不超过画面 10%', '灰色的冷暖倾向要与主体呼应'],
      },
    ],
    exercises: [
      '做一张 24 格色卡，每个格子标注色相和明度感受',
      '找 3 张喜欢的插画，指出它的主色、辅色和点缀色比例',
      '用两种互补色画一张 5 分钟小色稿',
    ],
    reference: {
      id: 'color-basics',
      title: '12 色色环参考图',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <g stroke="#ffffff" stroke-width="2">
    <path d="M200 150L200 50A100 100 0 0 1 250 63.4Z" fill="#e03131"/>
    <path d="M200 150L250 63.4A100 100 0 0 1 286.6 100Z" fill="#e8590c"/>
    <path d="M200 150L286.6 100A100 100 0 0 1 300 150Z" fill="#f76707"/>
    <path d="M200 150L300 150A100 100 0 0 1 286.6 200Z" fill="#f59f00"/>
    <path d="M200 150L286.6 200A100 100 0 0 1 250 236.6Z" fill="#ffd43b"/>
    <path d="M200 150L250 236.6A100 100 0 0 1 200 250Z" fill="#a9e34b"/>
    <path d="M200 150L200 250A100 100 0 0 1 150 236.6Z" fill="#51cf66"/>
    <path d="M200 150L150 236.6A100 100 0 0 1 113.4 200Z" fill="#20c997"/>
    <path d="M200 150L113.4 200A100 100 0 0 1 100 150Z" fill="#339af0"/>
    <path d="M200 150L100 150A100 100 0 0 1 113.4 100Z" fill="#5c7cfa"/>
    <path d="M200 150L113.4 100A100 100 0 0 1 150 63.4Z" fill="#845ef7"/>
    <path d="M200 150L150 63.4A100 100 0 0 1 200 50Z" fill="#d6336c"/>
  </g>
  <circle cx="200" cy="150" r="100" fill="none" stroke="currentColor" stroke-width="1.5"/>
</svg>`,
    },
  },
  {
    id: 'head-proportions',
    emoji: '🙂',
    title: '头像比例',
    subtitle: '三庭五眼画人脸',
    difficulty: '中级',
    estimatedMinutes: 60,
    description:
      '掌握“三庭五眼”定位法与头部十字线，画出比例正确的正面与 3/4 侧头像。',
    goals: [
      '掌握“三庭五眼”定位法',
      '会用十字线确定头部朝向',
      '能画出比例正确的正面与 3/4 侧五官',
    ],
    explanation: [
      '三庭五眼是中文绘画传统里最实用的比例口诀：发际线到眉、眉到鼻底、鼻底到下巴，长度相等，叫“三庭”；正面脸的宽度等于五个眼睛的宽度，叫“五眼”。它不是标准答案，而是检查偏差的标尺。',
      '十字线决定头的朝向：先画一个代表头颅的椭圆，再画一条竖线（中线）和一条横线（眼线）。中线偏向哪边、眼线如何弯曲，头就朝向哪里，五官都“挂”在这两条线上。',
      '五官的位置有规律：眼睛在头颅（从头顶到下巴）约 1/2 处；耳朵上缘与眉齐平、下缘与鼻底齐平；嘴的宽度约等于两瞳孔间距。记住这些“锚点”，画谁都不会太离谱。',
    ],
    steps: [
      {
        id: 'head-proportions-step-1',
        title: '画头部基准',
        description:
          '画一个椭圆代表头颅，加上十字线。标出三庭：发际线、眉线、鼻底、下巴四条横线，检查三段是否等长。',
        tips: ['眼线在头颅纵长的 1/2 处', '先画光头基准，发型最后再加'],
      },
      {
        id: 'head-proportions-step-2',
        title: '五眼与五官定位',
        description:
          '在眼线上按五等分定位：外眼角到脸侧、两只眼、眼间距各占一等份。先画出眼睛与眉毛，再按“鼻宽≈眼间距”画鼻子。',
        tips: ['先只画辅助线和定位点，确认无误再落五官', '两眼间距正好是一只眼的宽度'],
      },
      {
        id: 'head-proportions-step-3',
        title: '嘴与耳',
        description:
          '嘴缝线在下庭的上 1/3 处，嘴角大致对齐瞳孔内侧；耳朵画在眉线与鼻底之间。',
        tips: ['正面头像耳朵容易画得过大，对照镜子检查', '嘴角上扬一点点，表情会自然很多'],
      },
      {
        id: 'head-proportions-step-4',
        title: '3/4 侧头像',
        description:
          '把中线移向一侧，眼线随头颅球面弯曲，近侧五官大、远侧压缩。重复“定位—检查—落笔”的流程完成一张 3/4 侧。',
        tips: ['远侧眼睛只画到中线附近，宽度明显变窄', '眼线弧度与头的转动方向一致'],
      },
    ],
    exercises: [
      '画 5 个不同角度的光头十字线基准，不画五官',
      '对着镜子画一张正面自画像，用三庭五眼自查偏差',
      '找一张证件照，用十字线法起稿临摹',
    ],
    reference: {
      id: 'head-proportions',
      title: '头像比例参考图',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
  <ellipse cx="200" cy="145" rx="85" ry="115"/>
  <g stroke-width="1.2" stroke-dasharray="5 5">
    <path d="M200 25v240"/>
    <path d="M120 65H280"/>
    <path d="M115 130H285"/>
    <path d="M112 145H288"/>
    <path d="M120 195H280"/>
    <path d="M130 222H270"/>
    <path d="M40 260H360"/>
    <path d="M115 138v14M149 138v14M183 138v14M217 138v14M251 138v14M285 138v14"/>
  </g>
  <path d="M151 145q16-9 30 0q-14 9-30 0" stroke-width="2"/>
  <path d="M219 145q16-9 30 0q-14 9-30 0" stroke-width="2"/>
  <path d="M150 128q16-7 30-2" stroke-width="2"/>
  <path d="M220 126q14-5 30 2" stroke-width="2"/>
  <path d="M200 195q-7 10 2 13" stroke-width="2"/>
  <path d="M180 222q20 9 40 0" stroke-width="2"/>
  <path d="M115 132c-9 12-9 32 2 44" stroke-width="2"/>
  <path d="M285 132c9 12 9 32-2 44" stroke-width="2"/>
</svg>`,
    },
  },
];

/** 按 id 查找课程 */
export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
