import { Subject, Lesson, Topic, UserProgress, RecallItem } from '../types';

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    icon: '📐',
    progress: 75,
    lastAccessed: '2 hours ago',
    totalLessons: 12,
    completedLessons: 9,
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Python Programming',
    icon: '🐍',
    progress: 45,
    lastAccessed: '1 day ago',
    totalLessons: 15,
    completedLessons: 7,
    color: '#8B5CF6'
  },
  {
    id: '3',
    name: 'Machine Learning',
    icon: '🤖',
    progress: 20,
    lastAccessed: '3 days ago',
    totalLessons: 20,
    completedLessons: 4,
    color: '#10B981'
  },
  {
    id: '4',
    name: 'Cloud Computing',
    icon: '☁️',
    progress: 60,
    lastAccessed: '5 hours ago',
    totalLessons: 10,
    completedLessons: 6,
    color: '#F59E0B'
  }
];

export const mockLessons: Lesson[] = [
  {
    id: '1',
    subjectId: '1',
    title: 'Linear Algebra Fundamentals',
    topics: 8,
    completion: 100,
    estimatedTime: '2.5 hours',
    difficulty: 'Beginner',
    description: 'Master the basics of vectors, matrices, and linear transformations'
  },
  {
    id: '2',
    subjectId: '1',
    title: 'Calculus Integration',
    topics: 12,
    completion: 75,
    estimatedTime: '3 hours',
    difficulty: 'Intermediate',
    description: 'Learn integration techniques and applications'
  },
  {
    id: '3',
    subjectId: '2',
    title: 'Python Basics',
    topics: 10,
    completion: 90,
    estimatedTime: '4 hours',
    difficulty: 'Beginner',
    description: 'Variables, functions, and control structures'
  },
  {
    id: '4',
    subjectId: '2',
    title: 'Object-Oriented Programming',
    topics: 15,
    completion: 30,
    estimatedTime: '5 hours',
    difficulty: 'Intermediate',
    description: 'Classes, inheritance, and design patterns'
  }
];

export const mockTopics: Topic[] = [
  {
    id: '1',
    lessonId: '1',
    title: 'Vector Operations',
    estimatedTime: '20 min',
    completion: 100,
    content: {
      text: `# Vector Operations

Vectors are fundamental mathematical objects that represent both magnitude and direction. In this comprehensive guide, we'll explore the essential operations you can perform with vectors.

## What is a Vector?

A vector is a mathematical object that has both magnitude (length) and direction. Unlike scalars, which only have magnitude, vectors provide complete information about quantity and orientation in space.

## Basic Vector Operations

### Vector Addition
When adding vectors, we combine their components:
- **Component-wise addition**: (a₁, a₂) + (b₁, b₂) = (a₁ + b₁, a₂ + b₂)
- **Geometric interpretation**: Place vectors head-to-tail

### Scalar Multiplication
Multiplying a vector by a scalar changes its magnitude:
- **Formula**: k × (a₁, a₂) = (k × a₁, k × a₂)
- **Effect**: Scales the vector while preserving direction

### Dot Product
The dot product produces a scalar value:
- **Formula**: a · b = |a| × |b| × cos(θ)
- **Applications**: Measuring similarity, calculating work

### Cross Product
Available in 3D, produces a perpendicular vector:
- **Formula**: a × b = |a| × |b| × sin(θ) × n̂
- **Applications**: Finding perpendicular directions, calculating torque

## Real-World Applications

Vectors are everywhere in practical applications:
- **Physics**: Force, velocity, acceleration
- **Computer Graphics**: 3D transformations, lighting
- **Engineering**: Structural analysis, fluid dynamics
- **Data Science**: Feature vectors, embeddings`,
      videoUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
      comicPanels: [
        {
          id: '1',
          imageUrl: 'https://images.pexels.com/photos/5427656/pexels-photo-5427656.jpeg',
          caption: 'Meet Vector, our mathematical hero!',
          dialogue: 'I have both magnitude AND direction!'
        },
        {
          id: '2',
          imageUrl: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg',
          caption: 'Vector encounters his nemesis, Scalar',
          dialogue: 'You only have magnitude! I am superior!'
        },
        {
          id: '3',
          imageUrl: 'https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg',
          caption: 'Together they perform vector addition',
          dialogue: 'Wait... we can work together!'
        }
      ]
    },
    quiz: {
      question: 'If you had to explain vectors to your pet goldfish, which statement would confuse them the LEAST?',
      options: [
        'Vectors are like really pretentious arrows that think they\'re better than regular numbers',
        'A vector is just a number having an identity crisis',
        'Vectors have both magnitude and direction, unlike your life choices',
        'It\'s basically math trying to be fancy with coordinates'
      ],
      correctAnswer: 0,
      sarcasticFeedback: {
        correct: 'Wow! Your goldfish would actually understand that. Maybe there\'s hope for you after all! 🐠✨',
        incorrect: [
          'Your goldfish just swam away in disappointment. Even THEY know vectors better than that!',
          'That explanation would make even a mathematician cry. Try again, champ!',
          'I\'ve seen more clarity in muddy water. Let\'s try this again, shall we?'
        ]
      }
    },
    activity: {
      type: 'code',
      instructions: 'Calculate the dot product of vectors a = [3, 4] and b = [2, 1]',
      starterCode: `def dot_product(a, b):
    # Calculate the dot product of two vectors
    # a and b are lists representing vectors
    result = 0
    
    # Your code here
    
    return result

# Test vectors
vector_a = [3, 4]
vector_b = [2, 1]

print(f"Dot product: {dot_product(vector_a, vector_b)}")`,
      solution: `def dot_product(a, b):
    result = 0
    for i in range(len(a)):
        result += a[i] * b[i]
    return result`
    }
  }
];

export const mockUserProgress: UserProgress = {
  xp: 2450,
  level: 7,
  streak: 12,
  badges: ['Vector Master', 'Code Ninja', 'Quiz Survivor', 'Streak Legend'],
  totalTimeSpent: 34.5, // hours
  topicsCompleted: 47
};

export const mockRecallItems: RecallItem[] = [
  {
    id: '1',
    topicId: '1',
    topicTitle: 'Vector Operations',
    subjectName: 'Mathematics',
    dueDate: new Date(),
    difficulty: 3,
    lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    topicId: '2',
    topicTitle: 'Python Functions',
    subjectName: 'Python Programming',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    difficulty: 2
  },
  {
    id: '3',
    topicId: '3',
    topicTitle: 'Neural Networks Intro',
    subjectName: 'Machine Learning',
    dueDate: new Date(),
    difficulty: 4,
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];