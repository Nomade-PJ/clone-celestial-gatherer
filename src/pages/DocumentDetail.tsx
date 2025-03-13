
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  DownloadIcon, 
  FileTextIcon, 
  CalendarIcon, 
  UserIcon, 
  DollarSignIcon 
} from 'lucide-react';
import { exportDocumentToPDF } from '@/lib/export-utils';

type DocumentStatus = 'Emitida' | 'Cancelada' | 'Pendente';

interface DocumentItem {
  description: string;
  quantity: number;
  unitValue: number;
  ncm?: string;
  cfop?: string;
}

interface Document {
  id: string;
  type: 'nfe' | 'nfce' | 'nfse';
  number: string;
  customer: string;
  date: string;
  value: number;
  status: DocumentStatus;
  items: DocumentItem[];
  paymentMethod: string;
  observations?: string;
}

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = () => {
      try {
        const savedDocuments = localStorage.getItem('pauloCell_documents');
        if (!savedDocuments) {
          toast.error('Nenhum documento encontrado');
          navigate('/documents');
          return;
        }

        const documents = JSON.parse(savedDocuments);
        const doc = documents.find((d: Document) => d.id === id);

        if (!doc) {
          toast.error('Documento não encontrado');
          navigate('/documents');
          return;
        }

        setDocument(doc);
      } catch (error) {
        console.error('Error loading document:', error);
        toast.error('Erro ao carregar documento');
        navigate('/documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, navigate]);

  const handleStatusChange = (newStatus: DocumentStatus) => {
    if (!document) return;

    try {
      const savedDocuments = localStorage.getItem('pauloCell_documents');
      if (!savedDocuments) return;
      
      const documents = JSON.parse(savedDocuments);
      
      const updatedDocuments = documents.map((doc: Document) => {
        if (doc.id === document.id) {
          return { ...doc, status: newStatus };
        }
        return doc;
      });
      
      localStorage.setItem('pauloCell_documents', JSON.stringify(updatedDocuments));
      
      setDocument({ ...document, status: newStatus });
      toast.success(`Status alterado para ${newStatus}`);
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error('Erro ao atualizar status do documento');
    }
  };

  const handlePrint = () => {
    if (!document) return;
    
    try {
      window.print();
      toast.success('Documento enviado para impressão');
    } catch (error) {
      console.error('Error printing document:', error);
      toast.error('Erro ao imprimir documento');
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    try {
      const success = exportDocumentToPDF(document, [
        'number', 'type', 'customer', 'date', 'value', 'status', 
        'paymentMethod', 'items', 'observations'
      ]);
      
      if (success) {
        toast.success('Documento exportado com sucesso');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Erro ao baixar documento');
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getFormattedValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch(status) {
      case 'Emitida':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 flex justify-center items-center h-[80vh]">
          <p>Carregando...</p>
        </div>
      </MainLayout>
    );
  }

  if (!document) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <p>Documento não encontrado</p>
          <Button onClick={() => navigate('/documents')} variant="outline" className="mt-4">
            Voltar para Documentos
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/documents')}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detalhes do Documento</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Informações do Documento</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}>
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <FileTextIcon className="w-4 h-4" />
                    Número
                  </h3>
                  <p className="text-muted-foreground">{document.number}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Data
                  </h3>
                  <p className="text-muted-foreground">
                    {getFormattedDate(document.date)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Cliente
                  </h3>
                  <p className="text-muted-foreground">{document.customer}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSignIcon className="w-4 h-4" />
                    Valor Total
                  </h3>
                  <p className="text-muted-foreground">
                    {getFormattedValue(document.value)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    Status
                  </h3>
                  <div className="mt-1">
                    <Select 
                      defaultValue={document.status} 
                      onValueChange={(value) => handleStatusChange(value as DocumentStatus)}
                    >
                      <SelectTrigger className={`w-[110px] h-7 px-2 py-0 text-xs font-medium ${getStatusColor(document.status)}`}>
                        <SelectValue>{document.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emitida">Emitida</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Valor Unitário</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(item.unitValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(item.quantity * item.unitValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {document.observations && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{document.observations}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentDetail;
