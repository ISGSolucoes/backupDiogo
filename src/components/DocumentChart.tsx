
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentChartProps {
  data?: any[];
  type?: 'bar' | 'pie';
  title?: string;
  className?: string;
}

const DocumentChart: React.FC<DocumentChartProps> = ({ 
  data = [], 
  type = 'bar', 
  title = 'Documentos por Status',
  className = ''
}) => {
  const defaultData = [
    { name: 'Aprovados', value: 45, color: '#10b981' },
    { name: 'Pendentes', value: 23, color: '#f59e0b' },
    { name: 'Rejeitados', value: 8, color: '#ef4444' },
    { name: 'Em Análise', value: 12, color: '#3b82f6' }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'bar' ? renderBarChart() : renderPieChart()}
      </CardContent>
    </Card>
  );
};

export default DocumentChart;
