import React from 'react';
import './index.css';
import 'antd/dist/antd.css';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


import { Button, Modal, Form, Input, Table, Popconfirm, Icon } from 'antd';


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(

  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Cadastrar de cliente"
          okText="Cadastrar"
          cancelText="Cancelar"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
            <Form.Item label="Nome">
              {getFieldDecorator('nome', {
                rules: [{ required: true, message: 'Por favor, insira os dados!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Telefone">
              {getFieldDecorator('telefone', {
                rules: [{ required: true, message: 'Por favor, insira os dados!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="E-mail">
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Por favor, insira os dados!' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        width: '5%',
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        width: '35%',
        editable: true,
      },
      {
        title: 'Telefone',
        dataIndex: 'telefone',
        width: '17%',
        editable: true,
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        width: '35%',
        editable: true,
      },
      {
        title: 'Operação',
        dataIndex: 'operation',
        width: '6%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Deseja realmente excluir?" 
            cancelText="Cancelar"onConfirm={() => this.handleDelete(record.key)}>
              <DeleteForeverIcon color="secondary" style={{ fontSize: 30 }} className = "delet"/>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [
       
      ],
      count: 0,
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {

    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { count, dataSource } = this.state;
//
      const newData = {
        id: count + 1,
        key: count,
        nome: values.nome,
        telefone: values.telefone,
        email: values.email,
      };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });

    //
      console.log('debug: ', dataSource);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <h1 className="subTitulo" >Agenda de contatos</h1>
        <Button type="primary" className="mod" onClick={this.showModal}>
            Cadastrar
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        <br />
        <br />

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          />
      </div>
    );
  }
}
export default CollectionsPage;