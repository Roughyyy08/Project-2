import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { categories } from '../data/categories.js';
import { useFinance } from '../context/FinanceContext.jsx';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().typeError('Amount must be a number').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: yup.date().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean()
});

const defaultValues = {
  title: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
  recurring: false
};

function AddTransaction() {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionToEdit = location.state?.transaction;
  const { addTransaction, updateTransaction } = useFinance();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  useEffect(() => {
    if (transactionToEdit) {
      reset({
        ...transactionToEdit,
        date:
          typeof transactionToEdit.date === 'string'
            ? transactionToEdit.date.slice(0, 10)
            : transactionToEdit.date instanceof Date
            ? transactionToEdit.date.toISOString().slice(0, 10)
            : defaultValues.date,
        recurring: Boolean(transactionToEdit.recurring)
      });
    } else {
      reset(defaultValues);
    }
  }, [transactionToEdit, reset]);

  const onSubmit = (values) => {
    const payload = {
      ...values,
      amount: Number(values.amount),
      recurring: Boolean(values.recurring),
      date:
        typeof values.date === 'string'
          ? values.date
          : values.date instanceof Date
          ? values.date.toISOString().slice(0, 10)
          : defaultValues.date
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, payload);
      toast.success('Transaction updated');
    } else {
      addTransaction(payload);
      toast.success('Transaction added');
    }
    navigate('/transactions');
  };

  return (
    <div>
      <h2 className="page-title">{transactionToEdit ? 'Edit' : 'Add'} Transaction</h2>
      <div className="card" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-gap" style={{ gap: '1rem' }}>
          <div style={{ flex: '1 1 360px' }}>
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input id="title" type="text" {...register('title')} />
              {errors.title && <p className="small-text">{errors.title.message}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="amount">Amount</label>
              <input id="amount" type="number" step="1" {...register('amount')} />
              {errors.amount && <p className="small-text">{errors.amount.message}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="category">Category</label>
              <select id="category" {...register('category')}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.category && <p className="small-text">{errors.category.message}</p>}
            </div>
          </div>

          <div style={{ flex: '1 1 320px' }}>
            <div className="input-group">
              <label htmlFor="type">Type</label>
              <select id="type" {...register('type')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              {errors.type && <p className="small-text">{errors.type.message}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" {...register('date')} />
              {errors.date && <p className="small-text">{errors.date.message}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="recurring">Recurring expense</label>
              <input id="recurring" type="checkbox" {...register('recurring')} style={{ width: 'auto' }} />
            </div>
          </div>

          <div style={{ flex: '1 1 100%' }}>
            <div className="input-group">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows="4" {...register('notes')} />
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="secondary" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
