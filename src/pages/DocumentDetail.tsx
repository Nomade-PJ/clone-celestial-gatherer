import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileTextIcon,
  PrinterIcon,
  DownloadIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  DollarSignIcon
} from 'lucide-react';

interface Document {
  id: string;
  type: 'nfe' | 'nfce' | 'nfse';
  number: string;
  customer: string;
  date: string;
  value: number;
  status: 'Emitida' | 'Cancelada' | 'Pendente';
  items: Array<{
    description: string;
    quantity: number;
    unitValue: number;
  }>;
  paymentMethod: string;
  observations?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // Carregar dados do documento
    const savedDocuments = localStorage.getItem('pauloCell_documents');
    if (savedDocuments && id) {
      const documents = JSON.parse(savedDocuments);
      const foundDocument = documents.find((d: Document) => d.id === id);
      if (foundDocument) {
        setDocument(foundDocument);

        // Carregar dados do cliente
        const savedCustomers = localStorage.getItem('pauloCell_customers');
        if (savedCustomers) {
          const customers = JSON.parse(savedCustomers);
          const foundCustomer = customers.find((c: Customer) => c.id === foundDocument.customer);
          if (foundCustomer) {
            setCustomer(foundCustomer);
          }
        }
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implementar download do documento
  };

  if (!document || !customer) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <p>Documento não encontrado</p>
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
                    {new Date(document.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Cliente
                  </h3>
                  <p className="text-muted-foreground">{customer.name}</p>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSignIcon className="w-4 h-4" />
                    Valor Total
                  </h3>
                  <p className="text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(document.value)}
                  </p>
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