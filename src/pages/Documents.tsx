import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileTextIcon,
  PlusIcon,
  PrinterIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  FileIcon,
  FileCheckIcon,
  FilePlusIcon,
  TrashIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { moveDocumentToTrash } from '@/lib/document-trash-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const savedDocuments = localStorage.getItem('pauloCell_documents');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  };

  const handleNewDocument = (type: 'nfe' | 'nfce' | 'nfse') => {
    navigate('/documents/new', { state: { documentType: type } });
  };

  const handleExport = () => {
    try {
      const filteredDocs = filterDocuments();
      const exportData = JSON.stringify(filteredDocs, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documentos.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Documentos exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar documentos');
    }
  };

  const filterDocuments = () => {
    return documents.filter(doc => {
      const matchesSearch = doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const handlePrint = (doc: Document) => {
    // Implementar lógica de impressão
    toast.info('Funcionalidade de impressão em desenvolvimento');
  };

  const handleDownload = (doc: Document) => {
    // Implementar lógica de download
    toast.info('Funcionalidade de download em desenvolvimento');
  };

  const handleDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };

  const confirmDelete = () => {
    if (!documentToDelete) return;
    
    try {
      const success = moveDocumentToTrash(documentToDelete);
      if (success) {
        loadDocuments(); // Refresh the list
        toast.success('Documento movido para a lixeira');
      } else {
        toast.error('Erro ao mover documento para a lixeira');
      }
    } catch (error) {
      console.error('Error moving document to trash:', error);
      toast.error('Erro ao mover documento para a lixeira');
    } finally {
      setDocumentToDelete(null); // Close the dialog
    }
  };

  const handleStatusChange = (documentId: string, newStatus: string) => {
    try {
      // Get current documents
      const savedDocuments = localStorage.getItem('pauloCell_documents');
      if (!savedDocuments) return;
      
      const documents = JSON.parse(savedDocuments);
      
      // Update document status
      const updatedDocuments = documents.map((doc: any) => {
        if (doc.id === documentId) {
          return { ...doc, status: newStatus };
        }
        return doc;
      });
      
      // Save updated documents
      localStorage.setItem('pauloCell_documents', JSON.stringify(updatedDocuments));
      
      // Update local state
      setDocuments(updatedDocuments);
      toast.success(`Status alterado para ${newStatus}`);
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error('Erro ao atualizar status do documento');
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Documentos Fiscais</h1>
          <div className="flex gap-2">
            <Button onClick={() => handleNewDocument('nfe')} variant="outline">
              <FileIcon className="w-4 h-4 mr-2" />
              Emitir NF-e
            </Button>
            <Button onClick={() => handleNewDocument('nfce')} variant="outline">
              <FileCheckIcon className="w-4 h-4 mr-2" />
              Emitir NFC-e
            </Button>
            <Button onClick={() => handleNewDocument('nfse')} variant="outline">
              <FilePlusIcon className="w-4 h-4 mr-2" />
              Emitir NFS-e
            </Button>
            <Button onClick={handleExport}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="nfe">NF-e</SelectItem>
                  <SelectItem value="nfce">NFC-e</SelectItem>
                  <SelectItem value="nfse">NFS-e</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Emitida">Emitida</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterDocuments().map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={() => navigate(`/documents/${doc.id}`)}>
                      {doc.number}
                    </TableCell>
                    <TableCell onClick={() => navigate(`/documents/${doc.id}`)}>
                      {doc.type.toUpperCase()}
                    </TableCell>
                    <TableCell onClick={() => navigate(`/documents/${doc.id}`)}>
                      {doc.customer}
                    </TableCell>
                    <TableCell onClick={() => navigate(`/documents/${doc.id}`)}>
                      {new Date(doc.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell onClick={() => navigate(`/documents/${doc.id}`)}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(doc.value)}
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={doc.status} 
                        onValueChange={(value) => handleStatusChange(doc.id, value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectTrigger className={`w-[110px] h-7 px-2 py-0 text-xs font-medium ${doc.status === 'Emitida' ? 'bg-green-100 text-green-800' : doc.status === 'Cancelada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          <SelectValue>{doc.status}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Emitida">Emitida</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrint(doc)}
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(doc)}
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filterDocuments().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileTextIcon className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">Nenhum documento encontrado</p>
                        <Button onClick={() => handleNewDocument('nfe')} variant="outline">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Novo Documento
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>
              O documento será movido para a lixeira. Você poderá restaurá-lo posteriormente se necessário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Documents;