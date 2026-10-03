import type { PracticeType } from '@/types';

/** 练习模式定义（练习中心、练习会话、首页每日练习共用） */
export interface PracticeMode {
  type: PracticeType;
  name: string;
  emoji: string;
  description: string;
  /** 分步玩法说明 */
  howTo: string[];
  /** 可选时长（秒）；一笔画不限时则为空数组 */
  durations: number[];
  defaultDuration: number;
  /** 是否倒计时（一笔画为正计时） */
  countDown: boolean;
}

export const PRACTICE_MODES: PracticeMode[] = [
  {
    type: 'gesture',
    name: '30 秒速写',
    emoji: '⏱️',
    description: '在极短时间内抓住物体的大形与动态，不抠细节，练“眼快手快”。',
    howTo: ['开始前先观察参考图 5 秒', '用长直线概括外轮廓，不要描边', '时间到立即停笔，检查大形是否站得住'],
    durations: [30, 60, 90],
    defaultDuration: 30,
    countDown: true,
  },
  {
    type: 'blind',
    name: '盲画',
    emoji: '🙈',
    description: '眼睛只看参考、不看画布，落笔时笔迹自动隐藏，训练手眼协调。',
    howTo: ['落笔后笔迹会自动隐藏，抬笔才能看到', '视线沿轮廓缓慢移动，手同步跟随', '尽量一气呵成，中途不要停顿太久'],
    durations: [120, 180, 300],
    defaultDuration: 180,
    countDown: true,
  },
  {
    type: 'oneline',
    name: '一笔画',
    emoji: '✍️',
    description: '只用一根不断开的线完成整幅造型，逼迫你提前规划路径。',
    howTo: ['落笔前先在脑中把路径走一遍', '笔不离“纸”，抬笔即锁定，可解锁重画', '允许线条来回重叠，形成网状感也是一种风格'],
    durations: [],
    defaultDuration: 0,
    countDown: false,
  },
  {
    type: 'timed',
    name: '临摹计时',
    emoji: '⏳',
    description: '设定时限专注临摹一张参考图，培养“起形—深入—检查”的完整流程。',
    howTo: ['前 1/4 时间只用直线起大形', '中间阶段确定比例与结构关系', '最后留 10% 时间退远整体检查'],
    durations: [60, 180, 300, 600],
    defaultDuration: 180,
    countDown: true,
  },
];

export function getPracticeMode(type: string): PracticeMode | undefined {
  return PRACTICE_MODES.find((m) => m.type === type);
}
