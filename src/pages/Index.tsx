import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface MemoCard {
  id: number;
  image: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  const [nuts, setNuts] = useState(150);
  const [activeSection, setActiveSection] = useState<'home' | 'poznajka' | 'poigrajka' | 'memo'>('home');
  const [memoCards, setMemoCards] = useState<MemoCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const poznajkaCategories = [
    { id: 'facts', title: 'Интересные факты', icon: 'Sparkles', color: 'bg-amber-500' },
    { id: 'state', title: 'Государственность', icon: 'Flag', color: 'bg-red-500' },
    { id: 'redbook', title: 'Красная книга', icon: 'Leaf', color: 'bg-green-600' },
    { id: 'nations', title: 'Народы', icon: 'Users', color: 'bg-blue-500' },
    { id: 'landmarks', title: 'Достопримечательности', icon: 'Castle', color: 'bg-purple-500' },
    { id: 'heroes', title: 'Выдающиеся личности', icon: 'Medal', color: 'bg-orange-600' },
  ];

  const poigrajkaGames = [
    { id: 'memo', title: 'Мемо', icon: 'Brain', nuts: 10 },
    { id: 'coloring', title: 'Раскраски', icon: 'Palette', nuts: 5 },
    { id: 'puzzles', title: 'Пазлы', icon: 'Puzzle', nuts: 15 },
    { id: 'riddles', title: 'Загадки', icon: 'MessageCircleQuestion', nuts: 8 },
    { id: 'math', title: 'Арифметика', icon: 'Calculator', nuts: 12 },
    { id: 'find', title: 'Искалочки', icon: 'Search', nuts: 10 },
    { id: 'rebus', title: 'Ребусы', icon: 'Book', nuts: 15 },
    { id: 'differences', title: 'Найди отличия', icon: 'Eye', nuts: 10 },
  ];

  const russianSymbols = [
    { id: 1, name: 'Матрёшка', image: 'https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/825a930a-586a-4318-9d13-5f4985aa64fe.jpg' },
    { id: 2, name: 'Балалайка', image: 'https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/cc007db5-58e8-433c-b472-41d179fc67a4.jpg' },
    { id: 3, name: 'Самовар', image: 'https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/938b1933-2df5-4c27-8c17-ba8d7fe23691.jpg' },
    { id: 4, name: 'Кокошник', image: 'https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/bbd18d61-712a-4201-9c02-0cdf40b64d3a.jpg' },
    { id: 5, name: 'Берёза', image: 'https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/bcf8fd86-1745-45f6-ad08-50a553bc4c70.jpg' },
    { id: 6, name: 'Медведь', image: 'https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/95c7e36f-e793-45cf-9045-783b0f8df0cd.jpg' },
  ];

  const initializeGame = () => {
    const shuffled = [...russianSymbols, ...russianSymbols]
      .map((item, index) => ({
        ...item,
        id: index,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setMemoCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(true);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || memoCards[index].isFlipped || memoCards[index].isMatched) {
      return;
    }

    const newCards = [...memoCards];
    newCards[index].isFlipped = true;
    setMemoCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (memoCards[first].name === memoCards[second].name) {
        setTimeout(() => {
          const updatedCards = [...memoCards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setMemoCards(updatedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          
          if (matchedPairs + 1 === 6) {
            const reward = 10;
            setNuts(nuts + reward);
            toast({
              title: '🎉 Победа!',
              description: `Ты выиграл ${reward} орешков! Ходов: ${moves + 1}`,
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          const updatedCards = [...memoCards];
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setMemoCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/34437f9f-69ad-43b3-ab94-82cfbffd5f7d.jpg)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-2xl border-4 border-primary bg-gradient-to-br from-amber-50 to-orange-50">
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center text-primary mb-4">
              Добро пожаловать в Матушку Россию! 🌲
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="relative w-48 h-48 animate-bounce-gentle">
              <img
                src="https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/758986ec-6b6f-4dc1-a890-632f81f4f88d.jpg"
                alt="Русская Белочка"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <div className="text-center space-y-4 px-6">
              <p className="text-xl font-semibold text-primary">
                Привет! Я — Русская Белочка! 🐿️
              </p>
              <p className="text-lg leading-relaxed text-foreground">
                Я приглашаю тебя в моё волшебное дерево! Здесь ты узнаешь много интересного о нашей прекрасной России и сыграешь в увлекательные игры.
              </p>
              <p className="text-lg leading-relaxed text-foreground">
                За каждое правильно выполненное задание ты получишь орешки! Собирай их, чтобы получить волшебные атрибуты для нашего приключения с Кощеем Бессмертным!
              </p>
              <div className="flex items-center justify-center gap-3 pt-4">
                <span className="text-6xl animate-float">🌰</span>
                <span className="text-2xl font-bold text-amber-700">= награда за знания!</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowWelcome(false)}
              className="text-xl px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Начать приключение! 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative z-10">
        <header className="bg-gradient-to-r from-primary via-accent to-primary text-white py-6 shadow-2xl border-b-4 border-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
                  <img
                    src="https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/758986ec-6b6f-4dc1-a890-632f81f4f88d.jpg"
                    alt="Белочка"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-shadow">Матушка Россия</h1>
                  <p className="text-sm opacity-90">Познавательная патриотическая программа</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Badge variant="secondary" className="px-6 py-3 text-xl font-bold bg-white text-amber-700 hover:bg-white shadow-lg">
                  <span className="text-2xl mr-2">🌰</span>
                  {nuts} орешков
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <nav className="bg-white shadow-lg border-b-2 border-primary/20">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-4">
              <Button
                variant={activeSection === 'home' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setActiveSection('home')}
                className="flex-1 text-lg font-bold"
              >
                <Icon name="Home" className="mr-2" />
                Главная
              </Button>
              <Button
                variant={activeSection === 'poznajka' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setActiveSection('poznajka')}
                className="flex-1 text-lg font-bold"
              >
                <Icon name="BookOpen" className="mr-2" />
                Познайка
              </Button>
              <Button
                variant={activeSection === 'poigrajka' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setActiveSection('poigrajka')}
                className="flex-1 text-lg font-bold"
              >
                <Icon name="Gamepad2" className="mr-2" />
                Поиграйка
              </Button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {activeSection === 'home' && (
            <div className="space-y-8 animate-fade-in">
              <div 
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-primary"
                style={{
                  backgroundImage: `url(https://cdn.poehali.dev/projects/7aec9868-f28f-4762-87c4-faa625abd8e0/files/7fd76225-32cf-43d0-847b-808562540fdf.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '400px',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="relative z-10 p-12 flex flex-col justify-end min-h-[400px]">
                  <h2 className="text-5xl font-extrabold text-white mb-4 text-shadow">
                    Волшебное дерево Белочки 🌳
                  </h2>
                  <p className="text-xl text-white max-w-2xl leading-relaxed">
                    Добро пожаловать в удивительный мир знаний о России! Изучай интересные факты, играй в игры и собирай орешки для великого приключения!
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-400 hover:shadow-2xl transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                      📚
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-blue-900 mb-3">Блок "Познайка"</h3>
                      <p className="text-blue-800 mb-4 leading-relaxed">
                        6 увлекательных разделов с информацией о государственности, природе, народах и великих людях России
                      </p>
                      <Button 
                        onClick={() => setActiveSection('poznajka')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Начать изучение
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-400 hover:shadow-2xl transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                      🎮
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-900 mb-3">Блок "Поиграйка"</h3>
                      <p className="text-green-800 mb-4 leading-relaxed">
                        127 увлекательных заданий в 8 категориях игр! Зарабатывай орешки и готовься к финальному приключению
                      </p>
                      <Button 
                        onClick={() => setActiveSection('poigrajka')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Играть
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-400">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">🏆</span>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900">Твой прогресс</h3>
                    <p className="text-purple-700">Собирай орешки и приближайся к финальному приключению!</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-purple-900">Орешки собраны</span>
                      <span className="font-bold text-purple-900">{nuts} / 500</span>
                    </div>
                    <Progress value={(nuts / 500) * 100} className="h-4" />
                  </div>
                  <p className="text-sm text-purple-700 italic">
                    Собери 500 орешков, чтобы начать финальное приключение с Кощеем Бессмертным!
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'poznajka' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-primary mb-3">📚 Блок "Познайка"</h2>
                <p className="text-xl text-muted-foreground">Узнай больше о нашей великой стране!</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poznajkaCategories.map((category) => (
                  <Card 
                    key={category.id}
                    className="p-6 hover:shadow-2xl transition-all cursor-pointer border-4 hover:scale-105 bg-white"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon name={category.icon as any} size={40} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                      <Button className="w-full">
                        Изучить
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'poigrajka' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-primary mb-3">🎮 Блок "Поиграйка"</h2>
                <p className="text-xl text-muted-foreground">127 увлекательных заданий ждут тебя!</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {poigrajkaGames.map((game) => (
                  <Card 
                    key={game.id}
                    className="p-6 hover:shadow-2xl transition-all cursor-pointer border-4 hover:scale-105 bg-gradient-to-br from-white to-amber-50"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon name={game.icon as any} size={32} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{game.title}</h3>
                      <Badge className="bg-amber-500 text-white">
                        <span className="mr-1">🌰</span>
                        +{game.nuts}
                      </Badge>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => {
                          if (game.id === 'memo') {
                            setActiveSection('memo');
                            initializeGame();
                          }
                        }}
                      >
                        Играть
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-8 bg-gradient-to-r from-orange-100 to-red-100 border-4 border-orange-400">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">⚔️</span>
                  <div>
                    <h3 className="text-2xl font-bold text-orange-900 mb-2">Финальное приключение</h3>
                    <p className="text-orange-800 leading-relaxed">
                      Собери достаточно орешков, получи волшебные атрибуты и помоги Белочке победить Кощея Бессмертного в интерактивном приключении!
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'memo' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="outline"
                  onClick={() => setActiveSection('poigrajka')}
                  className="gap-2"
                >
                  <Icon name="ArrowLeft" />
                  Назад к играм
                </Button>
                <div className="flex gap-4 items-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Ходов: {moves}
                  </Badge>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Пар: {matchedPairs} / 6
                  </Badge>
                </div>
                <Button onClick={initializeGame} variant="outline">
                  <Icon name="RotateCcw" className="mr-2" />
                  Новая игра
                </Button>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-primary mb-3">🧠 Игра "Мемо"</h2>
                <p className="text-xl text-muted-foreground">Найди все пары русских символов!</p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {memoCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      card.isMatched ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <div
                        className={`absolute inset-0 transition-all duration-500 transform ${
                          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                        }`}
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl border-4 border-white shadow-lg flex items-center justify-center"
                          style={{
                            backfaceVisibility: 'hidden',
                          }}
                        >
                          <span className="text-6xl">🌰</span>
                        </div>
                        
                        <div
                          className="absolute inset-0 bg-white rounded-2xl border-4 border-primary shadow-lg p-2"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {matchedPairs === 6 && (
                <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 border-4 border-green-400 max-w-2xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
                    <h3 className="text-3xl font-bold text-green-900">Поздравляем!</h3>
                    <p className="text-xl text-green-800">
                      Ты нашёл все пары за {moves} ходов!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-700">
                      <span className="text-4xl">🌰</span>
                      <span>+10 орешков</span>
                    </div>
                    <Button
                      size="lg"
                      onClick={initializeGame}
                      className="mt-4"
                    >
                      Сыграть ещё раз
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>

        <footer className="bg-gradient-to-r from-primary to-accent text-white py-8 mt-16 border-t-4 border-secondary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg font-semibold">
              Матушка Россия — познавательная патриотическая программа для детей
            </p>
            <p className="text-sm opacity-80 mt-2">
              Воспитываем любовь к Родине через игру и обучение 🇷🇺
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;