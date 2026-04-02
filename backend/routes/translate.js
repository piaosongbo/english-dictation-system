const express = require('express');
const router = express.Router();

// Simple in-memory dictionary for common words and phrases
const dictionary = {
  // Common words
  'apple': '苹果',
  'banana': '香蕉',
  'cat': '猫',
  'dog': '狗',
  'elephant': '大象',
  'fish': '鱼',
  'grape': '葡萄',
  'house': '房子',
  'ice': '冰',
  'juice': '果汁',
  'kite': '风筝',
  'lion': '狮子',
  'monkey': '猴子',
  'nose': '鼻子',
  'orange': '橙子',
  'pencil': '铅笔',
  'queen': '女王',
  'rabbit': '兔子',
  'sun': '太阳',
  'tiger': '老虎',
  'umbrella': '雨伞',
  'violin': '小提琴',
  'water': '水',
  'box': '盒子',
  'yellow': '黄色',
  'zoo': '动物园',
  'book': '书',
  'car': '汽车',
  'door': '门',
  'egg': '鸡蛋',
  'flower': '花',
  'girl': '女孩',
  'hand': '手',
  'island': '岛',
  'jacket': '夹克',
  'king': '国王',
  'lamp': '灯',
  'moon': '月亮',
  'nest': '鸟巢',
  'ocean': '海洋',
  'pen': '钢笔',
  'rose': '玫瑰',
  'star': '星星',
  'tree': '树',
  'uncle': '叔叔',
  'vase': '花瓶',
  'window': '窗户',
  'fox': '狐狸',
  'yo-yo': '悠悠球',
  'zebra': '斑马',
  'hello': '你好',
  'world': '世界',
  'good': '好',
  'morning': '早上',
  'night': '晚上',
  'day': '天',
  'time': '时间',
  'love': '爱',
  'friend': '朋友',
  'family': '家庭',
  'school': '学校',
  'teacher': '老师',
  'student': '学生',
  'happy': '快乐',
  'sad': '悲伤',
  'big': '大',
  'small': '小',
  'hot': '热',
  'cold': '冷',
  'new': '新',
  'old': '旧',
  'red': '红色',
  'blue': '蓝色',
  'green': '绿色',
  'black': '黑色',
  'white': '白色',
  'i': '我',
  'you': '你',
  'he': '他',
  'she': '她',
  'it': '它',
  'we': '我们',
  'they': '他们',
  'am': '是',
  'is': '是',
  'are': '是',
  'a': '一个',
  'an': '一个',
  'the': '这个',
  'my': '我的',
  'your': '你的',
  'his': '他的',
  'her': '她的',
  'our': '我们的',
  'their': '他们的',
  'this': '这个',
  'that': '那个',
  'these': '这些',
  'those': '那些',
  'and': '和',
  'or': '或者',
  'but': '但是',
  'in': '在...里面',
  'on': '在...上面',
  'at': '在',
  'to': '到',
  'from': '从',
  'with': '和...一起',
  'for': '为了',
  'of': '的',
  'about': '关于',
  'like': '喜欢',
  'want': '想要',
  'have': '有',
  'has': '有',
  'do': '做',
  'does': '做',
  'go': '去',
  'goes': '去',
  'come': '来',
  'comes': '来',
  'see': '看见',
  'sees': '看见',
  'look': '看',
  'looks': '看',
  'eat': '吃',
  'eats': '吃',
  'drink': '喝',
  'drinks': '喝',
  'play': '玩',
  'plays': '玩',
  'run': '跑',
  'runs': '跑',
  'walk': '走',
  'walks': '走',
  'sleep': '睡觉',
  'sleeps': '睡觉',
  'read': '读',
  'reads': '读',
  'write': '写',
  'writes': '写',
  'sing': '唱歌',
  'sings': '唱歌',
  'dance': '跳舞',
  'dances': '跳舞',
  'swim': '游泳',
  'swims': '游泳',
  'jump': '跳',
  'jumps': '跳',
  'sit': '坐',
  'sits': '坐',
  'stand': '站',
  'stands': '站',
  
  // Common phrases/sentences
  'how are you': '你好吗',
  'i am fine': '我很好',
  'thank you': '谢谢你',
  'you are welcome': '不客气',
  'good morning': '早上好',
  'good afternoon': '下午好',
  'good evening': '晚上好',
  'good night': '晚安',
  'goodbye': '再见',
  'see you': '再见',
  'nice to meet you': '很高兴认识你',
  'what is your name': '你叫什么名字',
  'my name is': '我的名字是',
  'how old are you': '你多大了',
  'i am': '我是',
  'years old': '岁',
  'where are you from': '你来自哪里',
  'i am from': '我来自',
  'what do you like': '你喜欢什么',
  'i like': '我喜欢',
  'do you like': '你喜欢吗',
  'yes i do': '是的，我喜欢',
  'no i do not': '不，我不喜欢',
  'what is this': '这是什么',
  'this is': '这是',
  'that is': '那是',
  'i have': '我有',
  'i do not have': '我没有',
  'can you': '你能',
  'i can': '我能',
  'i cannot': '我不能',
  'let us': '让我们',
  'let me': '让我',
  'i want': '我想要',
  'i do not want': '我不想要',
  'i love': '我爱',
  'i like to': '我喜欢',
  'i go to': '我去',
  'i play': '我玩',
  'i eat': '我吃',
  'i drink': '我喝',
  'i read': '我读',
  'i write': '我写',
  'i sing': '我唱歌',
  'i dance': '我跳舞',
  'i swim': '我游泳',
  'i run': '我跑',
  'i walk': '我走',
  'i sleep': '我睡觉',
  'i see': '我看见',
  'i look at': '我看着',
  'very much': '非常',
  'a lot': '很多',
  'every day': '每天',
  'every morning': '每天早上',
  'every night': '每天晚上',
  'at school': '在学校',
  'at home': '在家',
  'in the morning': '在早上',
  'in the afternoon': '在下午',
  'in the evening': '在晚上',
  'on monday': '在星期一',
  'on tuesday': '在星期二',
  'on wednesday': '在星期三',
  'on thursday': '在星期四',
  'on friday': '在星期五',
  'on saturday': '在星期六',
  'on sunday': '在星期日',
  'with my friend': '和我的朋友一起',
  'with my family': '和我的家人一起',
  'with my teacher': '和我的老师一起',
  'at the park': '在公园',
  'at the zoo': '在动物园',
  'in the classroom': '在教室里',
  'on the table': '在桌子上',
  'under the table': '在桌子下面',
  'in front of': '在...前面',
  'behind': '在...后面',
  'next to': '在...旁边',
  'between': '在...之间',
  'happy birthday': '生日快乐',
  'merry christmas': '圣诞快乐',
  'happy new year': '新年快乐',
};

// Baidu Translate API (requires appid and key)
// For now, use a simple fallback approach
async function translateWithBaidu(text, from, to) {
  // TODO: Implement Baidu Translate API
  // For now, return null to use fallback
  return null;
}

// Translate endpoint
router.post('/', async (req, res) => {
  try {
    const { text, from = 'en', to = 'zh' } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const trimmedText = text.trim().toLowerCase();
    
    // Check dictionary first (exact match for phrases)
    if (dictionary[trimmedText]) {
      return res.json({
        text: text,
        translation: dictionary[trimmedText],
        from,
        to,
        source: 'dictionary'
      });
    }
    
    // Try to find partial phrase matches (for sentences)
    // Sort dictionary keys by length (longest first) to match longer phrases first
    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
    
    let result = trimmedText;
    let hasTranslation = false;
    
    for (const key of sortedKeys) {
      if (key.includes(' ') && result.includes(key)) {
        result = result.replace(new RegExp(key, 'g'), dictionary[key]);
        hasTranslation = true;
      }
    }
    
    // If no phrase matches, translate word by word
    if (!hasTranslation) {
      const words = trimmedText.split(/\s+/);
      const translations = words.map(word => dictionary[word] || word);
      result = translations.join(' ');
      hasTranslation = translations.some((t, i) => t !== words[i]);
    }
    
    // Return the translation
    res.json({
      text: text,
      translation: result,
      from,
      to,
      source: hasTranslation ? 'fallback' : 'original'
    });
    
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
