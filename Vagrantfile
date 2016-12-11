# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(2) do |config|
    config.vm.define "nodejs.api.db" do |machine|
      machine.vm.box = "ubuntu/trusty64"
      machine.vm.hostname = "nodejs.api.db.vagrant.local"
      machine.vm.network "private_network", ip: "192.168.50.10"

      machine.vm.provider "virtualbox" do |vb|
         vb.memory = "512"
      end
      machine.vm.provision "shell", inline: <<-SHELL
        sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password rootpass'
        sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password rootpass'
        sudo apt-get update
        sudo apt-get -y install mysql-server-5.5

        if [ ! -f /var/log/databasesetup ];
        then
            echo "CREATE USER 'local'@'localhost' IDENTIFIED BY 'local';" | mysql -uroot -prootpass
            echo "CREATE USER 'local'@'%' IDENTIFIED BY 'local';" | mysql -uroot -prootpass
            echo "CREATE DATABASE nodejsApiDB;" | mysql -uroot -prootpass
            echo "GRANT ALL ON *.* TO 'local'@'localhost' IDENTIFIED BY 'local';" | mysql -uroot -prootpass
            echo "GRANT ALL ON *.* TO 'local'@'%' IDENTIFIED BY 'local';" | mysql -uroot -prootpass
            echo "flush privileges" | mysql -uroot -prootpass
            mysql -uroot -prootpass nodejsApiDB < /vagrant/sql-scripts/user.sql;
            mysql -uroot -prootpass nodejsApiDB < /vagrant/sql-scripts/profile.sql;
            touch /var/log/databasesetup
        fi
        
        echo "Updating mysql configs in /etc/mysql/my.cnf."
        sudo sed -i "s/.*bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
        echo "Updated mysql bind address in /etc/mysql/my.cnf to 0.0.0.0 to allow external connections."
        sudo service mysql stop
        sudo service mysql start
      SHELL
    end
end
