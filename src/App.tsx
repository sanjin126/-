import { useReducer, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  message,
  Select,
  Modal,
  Menu,
  Layout,
} from "antd";
import "antd/dist/reset.css";
import "./App.css";
import "./fonts.css";
import ReactMarkdown from "react-markdown";
import { getResponseFromOpenAI } from "./api/evaluateAnswer";

const { Option } = Select;
const { Header, Content } = Layout;

// Add Inter font
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

interface Evaluation {
  content: string;
  score?: number;
  timestamp: number;
}

interface Question {
  question: string;
  answer: string;
  showAnswerInput: boolean;
  category: string;
  evaluations: Evaluation[];
}

interface AppState {
  currentMenu: string;
  question: string;
  category: string;
  newCategory: string;
  selectedCategory: string;
  categories: string[];
  questionsList: Question[];
  viewingAnswerIndex: number | null;
}

type AppAction =
  | { type: 'SET_MENU'; payload: string }
  | { type: 'SET_QUESTION'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_NEW_CATEGORY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_VIEWING_INDEX'; payload: number | null };

function App() {
  const [state, dispatch] = useReducer<
    React.Reducer<AppState, AppAction>
  >(
    (state, action) => {
      switch (action.type) {
        case 'SET_MENU':
          return { ...state, currentMenu: action.payload };
        case 'SET_QUESTION':
          return { ...state, question: action.payload };
        case 'SET_CATEGORY':
          return { ...state, category: action.payload };
        case 'SET_NEW_CATEGORY':
          return { ...state, newCategory: action.payload };
        case 'SET_SELECTED_CATEGORY':
          return { ...state, selectedCategory: action.payload };
        case 'SET_CATEGORIES':
          return { ...state, categories: action.payload };
        case 'SET_QUESTIONS':
          return { ...state, questionsList: action.payload };
        case 'SET_VIEWING_INDEX':
          return { ...state, viewingAnswerIndex: action.payload };
        default:
          return state;
      }
    },
    {
      currentMenu: 'addQuestion',
      question: '',
      category: '',
      newCategory: '',
      selectedCategory: '',
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      questionsList: JSON.parse(localStorage.getItem('questionsList') || '[]'),
      viewingAnswerIndex: null
    }
  );

  const {
    currentMenu,
    question,
    category,
    newCategory,
    selectedCategory,
    categories,
    questionsList,
    viewingAnswerIndex
  } = state;

  const MAX_ANSWER_LINES = 3;

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem("questionsList");
      const storedCategories = localStorage.getItem("categories");
      if (storedQuestions) {
        dispatch({ type: 'SET_QUESTIONS', payload: JSON.parse(storedQuestions) });
      }
      if (storedCategories) {
        dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(storedCategories) });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error("加载数据失败");
    }
  }, []);

  // Save questions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("questionsList", JSON.stringify(questionsList));
    } catch (error) {
      console.error("Error saving questions:", error);
      message.error("保存题目失败");
    }
  }, [questionsList]);

  // Save categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories:", error);
      message.error("保存分类失败");
    }
  }, [categories]);

  const handleAddCategory = () => {
    if (!newCategory) {
      message.error("分类名称不能为空！");
      return;
    }
    if (categories.includes(newCategory)) {
      message.error("分类已存在！");
      return;
    }
    dispatch({ type: 'SET_CATEGORIES', payload: [...categories, newCategory] });
    dispatch({ type: 'SET_NEW_CATEGORY', payload: '' });
    message.success("分类添加成功！");
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    dispatch({ 
      type: 'SET_CATEGORIES', 
      payload: categories.filter((cat) => cat !== categoryToDelete) 
    });
    message.success("分类删除成功！");
  };

  const handleAddQuestion = () => {
    if (!question || !category) {
      message.error("题目和分类不能为空！");
      return;
    }
    const newQuestion = {
      question,
      answer: "",
      showAnswerInput: false,
      category,
      evaluations: []
    };
    dispatch({ type: 'SET_QUESTIONS', payload: [...questionsList, newQuestion] });
    dispatch({ type: 'SET_QUESTION', payload: '' });
    dispatch({ type: 'SET_CATEGORY', payload: '' });
    message.success("题目添加成功！");
  };

  const handleSubmitAnswer = async (index: number, answer: string) => {
    if (!answer) {
      message.error("答案不能为空！");
      return;
    }
    const updatedQuestions = [...questionsList];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      answer,
      showAnswerInput: false,
    };
    dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
    message.success("答案添加成功！");
  };

  const handleEvaluateAnswer = async (index: number) => {
    const answer = questionsList[index].answer;
    const question = questionsList[index].question;
    if (!answer) {
      message.error("没有答案可供评价！");
      return;
    }
    try {
      const evaluationContent = await getResponseFromOpenAI(question, answer);
      const evaluation: Evaluation = {
        content: evaluationContent,
        timestamp: Date.now()
      };
      
      message.info(`AI 评价: ${evaluationContent}`);
      const updatedQuestions = [...questionsList];
      updatedQuestions[index] = { 
        ...updatedQuestions[index], 
        evaluations: [...(updatedQuestions[index].evaluations || []), evaluation]
      };
      dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
      localStorage.setItem("questionsList", JSON.stringify(updatedQuestions));
    } catch (error) {
      message.error(error instanceof Error ? error.message : '评价失败');
    }
  };

  const handleDelete = (index: number) => {
    const updatedQuestions = questionsList.filter((_, i) => i !== index);
    dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
    message.success("删除成功！");
  };

  const toggleAnswerInput = (index: number) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      showAnswerInput: !updatedQuestions[index].showAnswerInput,
    };
    dispatch({ type: 'SET_QUESTIONS', payload: updatedQuestions });
  };

  return (
    <Layout className="layout">
      <Header style={{ padding: "0 24px" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentMenu]}
          onSelect={({ key }) => dispatch({ type: 'SET_MENU', payload: key })}
        >
          <Menu.Item key="addQuestion">添加题目</Menu.Item>
          <Menu.Item key="viewQuestions">查看题目</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {currentMenu === "addQuestion" && (
          <Card title="添加题目">
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="添加新分类"
                value={newCategory}
                onChange={(e) => dispatch({ type: 'SET_NEW_CATEGORY', payload: e.target.value })}
                style={{ width: 200, marginRight: 8 }}
              />
              <Button onClick={handleAddCategory}>添加分类</Button>
            </div>
            <Select
              style={{ width: 200, marginBottom: 16 }}
              placeholder="选择分类"
              value={category}
              onChange={(value) => dispatch({ type: 'SET_CATEGORY', payload: value })}
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                  <Button
                    size="small"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      Modal.confirm({
                        title: '确认删除',
                        content: `确定要删除分类 "${cat}" 吗？删除后无法恢复`,
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => handleDeleteCategory(cat),
                      });
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    删除
                  </Button>
                </Option>
              ))}
            </Select>
            <Input.TextArea
              placeholder="输入题目（支持Markdown格式）"
              value={question}
              onChange={(e) => dispatch({ type: 'SET_QUESTION', payload: e.target.value })}
              style={{ marginBottom: 16 }}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={(e) => {
                if (e.shiftKey) {
                  return; // Allow new lines with Shift+Enter
                }
                if (question.trim()) {
                  handleAddQuestion();
                  e.preventDefault();
                }
              }}
            />
            <Button 
              type="primary" 
              onClick={handleAddQuestion}
              disabled={!question.trim()}
            >
              添加题目 (Enter)
            </Button>
          </Card>
        )}

        {currentMenu === "viewQuestions" && (
          <div>
            <Select
              style={{ width: 200, marginBottom: 16 }}
              placeholder="选择分类筛选"
              value={selectedCategory}
              onChange={(value) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: value })}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            {questionsList
              .filter((q) => !selectedCategory || q.category === selectedCategory)
              .map((q, index) => (
                <Card
                  key={index}
                  style={{ marginBottom: 24 }}
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                        题目 {index + 1}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          backgroundColor: "#f1f5f9",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {q.category}
                      </span>
                    </div>
                  }
                  extra={
                    <div className="card-actions">
                      <Button 
                        danger 
                        onClick={() => {
                          Modal.confirm({
                            title: '确认删除',
                            content: '确定要删除这道题目吗？删除后无法恢复',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => handleDelete(index),
                          });
                        }}
                      >
                        删除
                      </Button>
                      <Button onClick={() => toggleAnswerInput(index)}>
                        {q.answer ? "修改答案" : "作答"}
                      </Button>
                      <Button
                        onClick={() => handleEvaluateAnswer(index)}
                        style={{ marginLeft: 8 }}
                      >
                        AI 评价
                      </Button>
                    </div>
                  }
                >
                  <div style={{ margin: "16px 0" }}>
                    <p style={{ fontSize: "1.25rem", fontWeight: 500, color: "var(--text-color)", lineHeight: 1.6 }}>
                      {q.question}
                    </p>
                  </div>
                  {q.answer && (
                    <div>
                      {viewingAnswerIndex === index ? (
                        <div>
                          <div className="markdown-content">
                            <ReactMarkdown className="react-markdown">
                              {q.answer}
                            </ReactMarkdown>
                          </div>
                          <Button
                            onClick={() => dispatch({ type: 'SET_VIEWING_INDEX', payload: null })}
                            style={{ marginTop: 8 }}
                          >
                            收起
                          </Button>
                        </div>
                      ) : (
                        <>
                          {q.answer.split("\n").length > MAX_ANSWER_LINES ? (
                            <>
                              <ReactMarkdown className="react-markdown">
                                {q.answer.split("\n").slice(0, MAX_ANSWER_LINES).join("\n")}
                              </ReactMarkdown>
                              <Button
                                onClick={() => dispatch({ type: 'SET_VIEWING_INDEX', payload: index })}
                                style={{ marginTop: 8, color: "#007bff" }}
                              >
                                展开
                              </Button>
                            </>
                          ) : (
                            <ReactMarkdown className="react-markdown">
                              {q.answer}
                            </ReactMarkdown>
                          )}
                        </>
                      )}
                          <Button
                            onClick={() =>
                              Modal.info({
                                title: "AI 评价历史",
                                content: (
                                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {q.evaluations?.slice().reverse().map((evalItem, i) => (
                                      <div key={i} style={{ 
                                        marginBottom: 16,
                                        padding: 16,
                                        border: '1px solid #f0f0f0',
                                        borderRadius: 4
                                      }}>
                                        <div style={{ 
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          marginBottom: 8,
                                          fontSize: '0.875rem',
                                          color: '#666'
                                        }}>
                                          <span>评价时间：{new Date(evalItem.timestamp).toLocaleString()}</span>
                                          {evalItem.score && (
                                            <span>评分：{evalItem.score}/10</span>
                                          )}
                                        </div>
                                        <div className="markdown-content" style={{ textAlign: "left" }}>
                                          <ReactMarkdown className="react-markdown">
                                            {evalItem.content}
                                          </ReactMarkdown>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ),
                                width: 800,
                              })
                            }
                            style={{ marginTop: 8 }}
                          >
                            查看评价历史 ({q.evaluations?.length || 0})
                          </Button>
                    </div>
                  )}
                  {q.showAnswerInput && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: 16 }}>
                        <div>
                          <Input.TextArea
                            placeholder="输入答案（支持Markdown格式）"
                            style={{ height: '200px', marginBottom: 8 }}
                            value={q.answer}
                            onChange={(e) => {
                              const updated = [...questionsList];
                              updated[index].answer = e.target.value;
                              dispatch({ type: 'SET_QUESTIONS', payload: updated });
                            }}
                          />
                          <Button
                            type="primary"
                            onClick={() => handleSubmitAnswer(index, q.answer)}
                            style={{ width: '100%' }}
                          >
                            提交答案 (Ctrl+Enter)
                          </Button>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: 8 }}>
                        提示：使用Shift+Enter换行，Ctrl+Enter提交
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App;
